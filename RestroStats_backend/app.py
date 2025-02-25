from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import pandas as pd
from datetime import datetime

app = Flask(__name__)

# Configure database (Change URL as per your database)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root@localhost/restaurant_db'
db = SQLAlchemy(app)

# Define Payment Model
class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    restaurant_id = db.Column(db.Integer, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)

db.create_all()

@app.route('/upload', methods=['POST'])
def upload_payments():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    df = pd.read_csv(file)
    
    for _, row in df.iterrows():
        payment = Payment(
            restaurant_id=row['restaurant_id'],
            amount=row['amount'],
            timestamp=datetime.strptime(row['timestamp'], '%Y-%m-%d %H:%M:%S')
        )
        db.session.add(payment)
    db.session.commit()
    
    return jsonify({'message': 'Data uploaded successfully'})

@app.route('/sales/<int:restaurant_id>', methods=['GET'])
def get_sales(restaurant_id):
    payments = Payment.query.filter_by(restaurant_id=restaurant_id).all()
    daily_sales = {}
    
    for payment in payments:
        date = payment.timestamp.date().strftime('%Y-%m-%d')
        daily_sales[date] = daily_sales.get(date, 0) + payment.amount
    
    return jsonify(daily_sales)

@app.route('/peak-hours/<int:restaurant_id>', methods=['GET'])
def get_peak_hours(restaurant_id):
    payments = Payment.query.filter_by(restaurant_id=restaurant_id).all()
    hourly_sales = {}
    
    for payment in payments:
        hour = payment.timestamp.hour
        hourly_sales[hour] = hourly_sales.get(hour, 0) + payment.amount
    
    peak_hour = max(hourly_sales, key=hourly_sales.get) if hourly_sales else None
    
    return jsonify({'peak_hour': peak_hour, 'hourly_sales': hourly_sales})

if __name__ == '__main__':
    app.run(debug=True)
