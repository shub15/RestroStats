from app1 import app, db

with app.app_context():  # Ensures app context exists
        db.create_all()