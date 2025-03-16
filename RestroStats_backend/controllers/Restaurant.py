from app import app, db, bcrypt, jwt

import pandas as pd
import pickle

from flask_cors import CORS
from datetime import datetime

from flask import jsonify, request
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

from entities.Restaurant import Restaurant
from entities.Payment import Payment

CORS(app)
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
# @jwt_required()
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
            # restaurant_id=restaurant_id,
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
# @jwt_required()
def get_sales():
    restaurant_id = get_jwt_identity()
    # payments = Payment.query.filter_by(restaurant_id=restaurant_id).all()
    payments = Payment.query.all()
    daily_sales = {}
    
    for payment in payments:
        date = payment.timestamp.date().strftime('%Y-%m-%d')
        daily_sales[date] = daily_sales.get(date, 0) + payment.transaction_amount
    
    return jsonify(daily_sales)

# Identify peak hours
@app.route('/peak-hours', methods=['GET'])
# @jwt_required()
def get_peak_hours():
    restaurant_id = get_jwt_identity()
    # payments = Payment.query.filter_by(restaurant_id=restaurant_id).all()
    payments = Payment.query.all()
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

@app.route('/transactions', methods=['GET'])
def transactions():
    # payments = Payment.query.all()
    payments = Payment.query.order_by(Payment.timestamp.desc()).limit(5).all()
    
    # Convert SQLAlchemy objects to dictionaries
    payment_list = []
    for payment in payments:
        payment_dict = {
            'order_id': payment.order_id,
            'timestamp'	: payment.timestamp,
            'item_name'	: payment.item_name,
            'item_price': payment.item_price,
            'quantity'	: payment.quantity,
            'transaction_amount': payment.transaction_amount,
            'transaction_type': payment.transaction_type,
        }
        payment_list.append(payment_dict)
    
    return jsonify(payment_list)