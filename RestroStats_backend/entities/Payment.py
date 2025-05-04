from app import db
from sqlalchemy.orm import relationship
from datetime import datetime

class Payment(db.Model):
    __tablename__ = 'payments'
    
    id = db.Column(db.Integer, primary_key=True)
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.id', ondelete='CASCADE'), nullable=False)
    order_id = db.Column(db.String(50), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    item_name = db.Column(db.String(100), nullable=False)
    item_price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    transaction_amount = db.Column(db.Float, nullable=False)
    transaction_type = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship with restaurant
    restaurant = relationship("Restaurant", back_populates="payments")
    
    # Define indexes for faster queries
    __table_args__ = (
        db.Index('idx_payment_restaurant_id', 'restaurant_id'),
        db.Index('idx_payment_timestamp', 'timestamp'),
        db.Index('idx_payment_restaurant_timestamp', 'restaurant_id', 'timestamp'),
    )
    
    def __repr__(self):
        return f"<Payment {self.order_id} - {self.transaction_amount}>"