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

if __name__ == '__main__':
    with app.app_context():  # Ensures app context exists
        db.create_all()
    app.run(debug=True)