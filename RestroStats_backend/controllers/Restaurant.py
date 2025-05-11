from app import (
    app,
    db,
    bcrypt,
    jwt,
    CORS,
    jsonify,
    request,
    create_access_token,
    get_jwt_identity,
    jwt_required,
    render_template,
)

import pandas as pd
import pickle
from datetime import datetime, timedelta

from entities.Restaurant import Restaurant
from entities.Payment import Payment
from entities.Bill import Bill
from entities.BillItem import BillItem

from prediction_models.food_sales_analysis import (
    generate_insights,
    analysis_results,
    df_clean,
    df_time_analysis,
)

CORS(app)


# User registration
@app.route("/register", methods=["POST"])
def register():
    data = request.json

    # Check if email already exists
    existing_restaurant = Restaurant.query.filter_by(email=data["email"]).first()
    if existing_restaurant:
        return jsonify({"error": "Email already registered"}), 409

    # Validate required fields
    required_fields = ["name", "email", "password", "city", "state"]
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({"error": f"Missing required field: {field}"}), 400

    # Hash password
    hashed_password = bcrypt.generate_password_hash(data["password"]).decode("utf-8")

    # Create new restaurant
    new_restaurant = Restaurant(
        name=data["name"],
        city=data["city"],
        state=data["state"],  # Fixed typo here - was ["state"]
        email=data["email"],
        phone=data["phone"],
        cuisine_type=data["cuisine_type"],
        password=hashed_password,
    )

    db.session.add(new_restaurant)
    db.session.commit()

    return (
        jsonify(
            {
                "message": "Restaurant registered successfully",
                "restaurant_id": new_restaurant.id,
            }
        ),
        201,
    )


# User login
@app.route("/login", methods=["POST"])
def login():
    data = request.json

    # Validate required fields
    if "email" not in data or "password" not in data:
        return jsonify({"error": "Email and password are required"}), 400

    restaurant = Restaurant.query.filter_by(email=data["email"]).first()

    if restaurant and bcrypt.check_password_hash(restaurant.password, data["password"]):
        # Create token with expiration (e.g., 24 hours)
        access_token = create_access_token(
            identity=str(restaurant.id), expires_delta=timedelta(hours=24)
        )
        return jsonify(
            {
                "access_token": access_token,
                "restaurant_id": restaurant.id,
                "restaurant_name": restaurant.name,
            }
        )

    return jsonify({"error": "Invalid credentials"}), 401


@app.route("/restaurant/profile", methods=["GET"])
@jwt_required()
def restaurant_profile():
    # Get the identity of the current user from the JWT token
    restaurant_id = get_jwt_identity()

    # Query the database to find the restaurant by ID
    restaurant = Restaurant.query.get(restaurant_id)

    if not restaurant:
        return jsonify({"error": "Restaurant not found"}), 404

    # Return the restaurant details
    return jsonify(
        {
            "id": restaurant.id,
            "name": restaurant.name,
            "email": restaurant.email,
            "city": restaurant.city,
            "state": restaurant.state,
            "cuisine_type": restaurant.cuisine_type,
            "phone": restaurant.phone,
            # Add any other non-sensitive fields you want to expose
        }
    )


# Update restaurant profile
@app.route("/restaurant/profile", methods=["PUT"])
@jwt_required()
def update_restaurant_profile():
    restaurant_id = get_jwt_identity()
    restaurant = Restaurant.query.get(restaurant_id)

    if not restaurant:
        return jsonify({"error": "Restaurant not found"}), 404

    data = request.json

    # Update fields if provided
    if "name" in data:
        restaurant.name = data["name"]
    if "city" in data:
        restaurant.city = data["city"]
    if "state" in data:
        restaurant.state = data["state"]
    if "cuisine_type" in data:
        restaurant.cusine_type = data["cuisine_type"]
    if "phone" in data:
        restaurant.phone = data["phone"]
    if "password" in data:  # Hash the new password
        restaurant.password = bcrypt.generate_password_hash(data["password"]).decode(
            "utf-8"
        )
    if "email" in data:  # Update email only if it's not already taken
        existing_restaurant = Restaurant.query.filter_by(email=data["email"]).first()
        if existing_restaurant and existing_restaurant.id != restaurant_id:
            return jsonify({"error": "Email already registered"}), 409
        restaurant.email = data["email"]  # Update email only if it's not already taken

    # Don't allow email updates through this endpoint for security

    db.session.commit()

    return jsonify({"message": "Profile updated successfully"})


# Upload and clean payment data
@app.route("/upload", methods=["POST"])
@jwt_required()
def upload_payments():
    restaurant_id = get_jwt_identity()
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    df = pd.read_csv(file)
    df = df.dropna()
    df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce")
    df = df.dropna(subset=["timestamp"])

    for _, row in df.iterrows():
        payment = Payment(
            restaurant_id=restaurant_id,
            order_id=row["order_id"],
            timestamp=row["timestamp"],
            item_name=row["item_name"],
            item_type=row["item_type"],
            item_price=row["item_price"],
            quantity=row["quantity"],
            transaction_amount=row["transaction_amount"],
            transaction_type=row.get("transaction_type", None),
            received_by=row["received_by"],
        )
        db.session.add(payment)
    db.session.commit()

    return jsonify({"message": "Data uploaded and cleaned successfully"})


# Analyze sales trends
@app.route("/sales", methods=["GET"])
@jwt_required()
def get_sales():
    restaurant_id = get_jwt_identity()
    payments = Payment.query.filter_by(restaurant_id=restaurant_id).all()
    # payments = Payment.query.all()
    daily_sales = {}

    for payment in payments:
        date = payment.timestamp.date().strftime("%Y-%m-%d")
        daily_sales[date] = daily_sales.get(date, 0) + payment.transaction_amount

    return jsonify(daily_sales)


# Identify peak hours
@app.route("/peak-hours", methods=["GET"])
@jwt_required()
def get_peak_hours():
    restaurant_id = get_jwt_identity()
    payments = Payment.query.filter_by(restaurant_id=restaurant_id).all()
    # payments = Payment.query.all()
    hourly_sales = {}

    for payment in payments:
        hour = payment.timestamp.hour
        hourly_sales[hour] = hourly_sales.get(hour, 0) + payment.transaction_amount

    peak_hour = max(hourly_sales, key=hourly_sales.get) if hourly_sales else None

    return jsonify({"peak_hour": peak_hour, "hourly_sales": hourly_sales})


@app.route("/predict", methods=["POST"])
@jwt_required()
def predict():
    data = request.json
    X_input = pd.DataFrame([data])  # Convert input JSON to DataFrame

    with open("sales_model.pkl", "rb") as f:
        model = pickle.load(f)

    prediction = model.predict(X_input)
    return jsonify({"predicted_sales": prediction[0]})


@app.route("/transactions/<limit>", methods=["GET"])
def transactions(limit):
    # payments = Payment.query.all()
    payments = Payment.query.order_by(Payment.timestamp.desc()).limit(limit).all()

    # Convert SQLAlchemy objects to dictionaries
    payment_list = []
    for payment in payments:
        payment_dict = {
            "order_id": payment.order_id,
            "timestamp": payment.timestamp,
            "item_name": payment.item_name,
            "item_price": payment.item_price,
            "quantity": payment.quantity,
            "transaction_amount": payment.transaction_amount,
            "transaction_type": payment.transaction_type,
        }
        payment_list.append(payment_dict)

    return jsonify(payment_list)


@app.route("/transactions/all", methods=["GET"])
def alltransactions():
    # payments = Payment.query.all()
    payments = Payment.query.order_by(Payment.timestamp.desc()).all()

    # Convert SQLAlchemy objects to dictionaries
    payment_list = []
    for payment in payments:
        payment_dict = {
            "order_id": payment.order_id,
            "timestamp": payment.timestamp,
            "item_name": payment.item_name,
            "item_price": payment.item_price,
            "quantity": payment.quantity,
            "transaction_amount": payment.transaction_amount,
            "transaction_type": payment.transaction_type,
        }
        payment_list.append(payment_dict)

    return jsonify(payment_list)


@app.route("/popularitem", methods=["GET"])
def popularitem():
    insights_list, top_item = generate_insights(df_clean, df_time_analysis)
    return jsonify({"popular_item": top_item})


@app.route("/insights", methods=["GET"])
def insights():
    insights_list, top_item = generate_insights(df_clean, df_time_analysis)
    return jsonify({"insights": insights_list})


@app.route("/generate-bill", methods=["POST"])
@jwt_required()
def generate_bill():
    # Get the restaurant ID from the JWT token
    restaurant_id = get_jwt_identity()
    data = request.json

    if not data:
        return jsonify({"error": "No data provided"}), 400

    # Validate required fields
    required_fields = [
        "billNumber",
        "date",
        "time",
        "customerName",
        "items",
        "grandTotal",
        "tax",
    ]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400

    # Convert date and time to datetime
    try:
        bill_datetime = datetime.strptime(
            f"{data['date']} {data['time']}", "%Y-%m-%d %H:%M"
        )
    except ValueError:
        return jsonify({"error": "Invalid date or time format"}), 400

    # Create new bill record
    new_bill = Bill(
        restaurant_id=restaurant_id,
        bill_number=data["billNumber"],
        timestamp=bill_datetime,
        customer_name=data["customerName"],
        table_number=data.get("tableNumber", ""),  # Optional field
        subtotal=data["grandTotal"],
        tax_amount=data["tax"],
        total_amount=data["grandTotal"] + data["tax"],
    )

    db.session.add(new_bill)
    db.session.flush()  # To get the bill ID

    # Add bill items
    for item in data["items"]:
        bill_item = BillItem(
            bill_id=new_bill.id,
            description=item["description"],
            quantity=item["quantity"],
            unit_price=item["price"],
            total_price=item["total"],
        )
        db.session.add(bill_item)

    try:
        db.session.commit()
        return (
            jsonify(
                {
                    "message": "Bill generated successfully",
                    "bill_id": new_bill.id,
                    "bill_number": new_bill.bill_number,
                }
            ),
            201,
        )
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to generate bill: {str(e)}"}), 500
    
# Get all bills for restaurant
@app.route("/bills", methods=["GET"])
@jwt_required()
def get_bills():
    restaurant_id = get_jwt_identity()
    
    # Get bills with newest first
    bills = Bill.query.filter_by(restaurant_id=restaurant_id).order_by(Bill.timestamp.desc()).all()
    
    bills_list = []
    for bill in bills:
        bill_dict = {
            "id": bill.id,
            "bill_number": bill.bill_number,
            "timestamp": bill.timestamp.strftime("%Y-%m-%d %H:%M"),
            "customer_name": bill.customer_name,
            "table_number": bill.table_number,
            "subtotal": bill.subtotal,
            "tax_amount": bill.tax_amount,
            "total_amount": bill.total_amount,
            "created_at": bill.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }
        bills_list.append(bill_dict)
    
    return jsonify(bills_list)

# Get specific bill with items
@app.route("/bills/<int:bill_id>", methods=["GET"])
@jwt_required()
def get_bill_detail(bill_id):
    restaurant_id = get_jwt_identity()
    
    bill = Bill.query.filter_by(id=bill_id, restaurant_id=restaurant_id).first()
    
    if not bill:
        return jsonify({"error": "Bill not found or unauthorized"}), 404
    
    items_list = []
    for item in bill.items:
        item_dict = {
            "id": item.id,
            "description": item.description,
            "quantity": item.quantity,
            "unit_price": item.unit_price,
            "total_price": item.total_price
        }
        items_list.append(item_dict)
    
    bill_dict = {
        "id": bill.id,
        "bill_number": bill.bill_number,
        "timestamp": bill.timestamp.strftime("%Y-%m-%d %H:%M"),
        "customer_name": bill.customer_name,
        "table_number": bill.table_number,
        "subtotal": bill.subtotal,
        "tax_amount": bill.tax_amount,
        "total_amount": bill.total_amount,
        "created_at": bill.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        "items": items_list
    }
    
    return jsonify(bill_dict)

# Delete a bill
@app.route("/bills/<int:bill_id>", methods=["DELETE"])
@jwt_required()
def delete_bill(bill_id):
    restaurant_id = get_jwt_identity()
    
    bill = Bill.query.filter_by(id=bill_id, restaurant_id=restaurant_id).first()
    
    if not bill:
        return jsonify({"error": "Bill not found or unauthorized"}), 404
    
    try:
        # This will also delete related bill items due to cascade="all, delete-orphan"
        db.session.delete(bill)
        db.session.commit()
        return jsonify({"message": "Bill deleted successfully"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to delete bill: {str(e)}"}), 500


# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Resource not found"}), 404


@app.errorhandler(500)
def server_error(error):
    return jsonify({"error": "Internal server error"}), 500


@app.errorhandler(401)
def unauthorized(error):
    return jsonify({"error": "Unauthorized access"}), 401


@app.errorhandler(403)
def forbidden(error):
    return jsonify({"error": "Access forbidden"}), 403
