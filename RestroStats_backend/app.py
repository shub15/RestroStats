from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    get_jwt_identity,
    jwt_required,
)
# from env import SQLALCHEMY_DATABASE_URI
import os
SQLALCHEMY_DATABASE_URI = os.environ.get("SQLALCHEMY_DATABASE_URI", "mysql+pymysql://root:root@localhost/restaurant_db")
JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "restaurant_db")

app = Flask(__name__)

# Configure database and secret key
app.config["SQLALCHEMY_DATABASE_URI"] = (SQLALCHEMY_DATABASE_URI)
app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY

# In your Flask app
app.config["JWT_TOKEN_LOCATION"] = ["headers"]
app.config["JWT_HEADER_NAME"] = "Authorization"
app.config["JWT_HEADER_TYPE"] = "Bearer"
db = SQLAlchemy(app)
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

from entities.Restaurant import Restaurant
from entities.Payment import Payment
from entities.Bill import Bill
from entities.BillItem import BillItem

# if you want to create table, comment out the next lines
from controllers import Restaurant
from controllers import Restaurant_Sales
