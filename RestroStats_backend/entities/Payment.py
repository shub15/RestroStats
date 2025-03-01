from app import db

# Define Payment Model
class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurant.id'), nullable=False)
    order_id = db.Column(db.String(50), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    item_name = db.Column(db.String(255), nullable=False)
    item_price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    transaction_amount = db.Column(db.Float, nullable=False)
    transaction_type = db.Column(db.String(50), nullable=True)