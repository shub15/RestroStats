from app import db
from datetime import datetime
from sqlalchemy.orm import relationship

class Restaurant(db.Model):
    __tablename__ = 'restaurants'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    
    # Additional fields that might be useful
    phone = db.Column(db.String(20), nullable=True)
    cuisine_type = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship with payment records
    payments = relationship("Payment", back_populates="restaurant", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Restaurant {self.name}>"
    
    def to_dict(self):
        """Convert restaurant to dictionary representation (excluding sensitive data)"""
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "city": self.city,
            "state": self.state,
            "cuisine_type": self.cuisine_type,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }