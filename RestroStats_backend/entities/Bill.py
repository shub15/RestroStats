# entities/Bill.py
from app import db
from datetime import datetime

class Bill(db.Model):
    __tablename__ = 'bills'
    
    id = db.Column(db.Integer, primary_key=True)
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.id'), nullable=False)
    bill_number = db.Column(db.String(50), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    customer_name = db.Column(db.String(100), nullable=False)
    table_number = db.Column(db.String(20))
    subtotal = db.Column(db.Float, nullable=False)
    tax_amount = db.Column(db.Float, nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    items = db.relationship('BillItem', backref='bill', lazy=True, cascade="all, delete-orphan")
    restaurant = db.relationship('Restaurant', backref='bills', lazy=True)
    
    def __repr__(self):
        return f'<Bill {self.bill_number}>'