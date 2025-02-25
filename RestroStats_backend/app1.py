import pickle
from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import pandas as pd
from datetime import datetime

app = Flask(__name__)

# Configure database and secret key
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root@localhost/restaurant_db'
app.config['JWT_SECRET_KEY'] = 'restaurant_db'
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Define User Model
class Restaurant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

# Define Payment Model
class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurant.id'), nullable=False)
    order_id = db.Column(db.String(50), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    item_name = db.Column(db.String(255), nullable=False)
    item_price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    transaction_amount = db.Column(db.Float, nullable=False)
    transaction_type = db.Column(db.String(50), nullable=True)

# User registration
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_restaurant = Restaurant(name=data['name'], email=data['email'], password=hashed_password)
    db.session.add(new_restaurant)
    db.session.commit()
    return jsonify({'message': 'Restaurant registered successfully'})

# User login
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    restaurant = Restaurant.query.filter_by(email=data['email']).first()
    if restaurant and bcrypt.check_password_hash(restaurant.password, data['password']):
        access_token = create_access_token(identity=restaurant.id)
        return jsonify({'access_token': access_token})
    return jsonify({'error': 'Invalid credentials'}), 401

# Upload and clean payment data
@app.route('/upload', methods=['POST'])
@jwt_required()
def upload_payments():
    restaurant_id = get_jwt_identity()
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    df = pd.read_csv(file)
    df = df.dropna()
    df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce')
    df = df.dropna(subset=['timestamp'])
    
    for _, row in df.iterrows():
        payment = Payment(
            restaurant_id=restaurant_id,
            order_id=row['order_id'],
            timestamp=row['timestamp'],
            item_name=row['item_name'],
            item_price=row['item_price'],
            quantity=row['quantity'],
            transaction_amount=row['transaction_amount'],
            transaction_type=row.get('transaction_type', None)
        )
        db.session.add(payment)
    db.session.commit()
    
    return jsonify({'message': 'Data uploaded and cleaned successfully'})

# Analyze sales trends
@app.route('/sales', methods=['GET'])
@jwt_required()
def get_sales():
    restaurant_id = get_jwt_identity()
    payments = Payment.query.filter_by(restaurant_id=restaurant_id).all()
    daily_sales = {}
    
    for payment in payments:
        date = payment.timestamp.date().strftime('%Y-%m-%d')
        daily_sales[date] = daily_sales.get(date, 0) + payment.transaction_amount
    
    return jsonify(daily_sales)

# Identify peak hours
@app.route('/peak-hours', methods=['GET'])
@jwt_required()
def get_peak_hours():
    restaurant_id = get_jwt_identity()
    payments = Payment.query.filter_by(restaurant_id=restaurant_id).all()
    hourly_sales = {}
    
    for payment in payments:
        hour = payment.timestamp.hour
        hourly_sales[hour] = hourly_sales.get(hour, 0) + payment.transaction_amount
    
    peak_hour = max(hourly_sales, key=hourly_sales.get) if hourly_sales else None
    
    return jsonify({'peak_hour': peak_hour, 'hourly_sales': hourly_sales})

@app.route('/predict', methods=['POST'])
# @jwt_required()
def predict():
    data = request.json
    X_input = pd.DataFrame([data])  # Convert input JSON to DataFrame

    with open("sales_model.pkl", "rb") as f:
        model = pickle.load(f)

    prediction = model.predict(X_input)
    return jsonify({'predicted_sales': prediction[0]})

if __name__ == '__main__':
    with app.app_context():  # Ensures app context exists
        db.create_all()
    app.run(debug=True)



