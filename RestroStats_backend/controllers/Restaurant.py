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

    # Optional date range filtering
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    query = Payment.query.filter_by(restaurant_id=restaurant_id)

    # Apply date filters if provided
    if start_date:
        try:
            start_date = datetime.strptime(start_date, "%Y-%m-%d")
            query = query.filter(Payment.timestamp >= start_date)
        except ValueError:
            return jsonify({"error": "Invalid start_date format. Use YYYY-MM-DD"}), 400

    if end_date:
        try:
            end_date = datetime.strptime(end_date, "%Y-%m-%d")
            # Make end_date inclusive by setting it to the end of the day
            end_date = end_date.replace(hour=23, minute=59, second=59)
            query = query.filter(Payment.timestamp <= end_date)
        except ValueError:
            return jsonify({"error": "Invalid end_date format. Use YYYY-MM-DD"}), 400

    payments = query.all()

    if not payments:
        return jsonify({"message": "No payment data found for this restaurant"}), 404

    daily_sales = {}
    for payment in payments:
        date = payment.timestamp.date().strftime("%Y-%m-%d")
        daily_sales[date] = daily_sales.get(date, 0) + payment.transaction_amount

    # Sort by date
    sorted_sales = {k: daily_sales[k] for k in sorted(daily_sales.keys())}

    return jsonify(
        {
            "daily_sales": sorted_sales,
            "total_sales": sum(sorted_sales.values()),
            "days_count": len(sorted_sales),
        }
    )


# Identify peak hours
@app.route("/peak-hours", methods=["GET"])
@jwt_required()
def get_peak_hours():
    restaurant_id = get_jwt_identity()

    # Optional date range filtering
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    query = Payment.query.filter_by(restaurant_id=restaurant_id)

    # Apply date filters if provided
    if start_date:
        try:
            start_date = datetime.strptime(start_date, "%Y-%m-%d")
            query = query.filter(Payment.timestamp >= start_date)
        except ValueError:
            return jsonify({"error": "Invalid start_date format. Use YYYY-MM-DD"}), 400

    if end_date:
        try:
            end_date = datetime.strptime(end_date, "%Y-%m-%d")
            # Make end_date inclusive by setting it to the end of the day
            end_date = end_date.replace(hour=23, minute=59, second=59)
            query = query.filter(Payment.timestamp <= end_date)
        except ValueError:
            return jsonify({"error": "Invalid end_date format. Use YYYY-MM-DD"}), 400

    payments = query.all()

    if not payments:
        return jsonify({"message": "No payment data found for this restaurant"}), 404

    hourly_sales = {}
    hourly_transactions = {}

    for payment in payments:
        hour = payment.timestamp.hour
        hourly_sales[hour] = hourly_sales.get(hour, 0) + payment.transaction_amount
        hourly_transactions[hour] = hourly_transactions.get(hour, 0) + 1

    peak_hour_sales = max(hourly_sales, key=hourly_sales.get) if hourly_sales else None
    peak_hour_transactions = (
        max(hourly_transactions, key=hourly_transactions.get)
        if hourly_transactions
        else None
    )

    # Format hours in 12-hour format with AM/PM
    formatted_hourly_sales = {}
    for hour, amount in hourly_sales.items():
        period = "AM" if hour < 12 else "PM"
        hour_12 = hour % 12
        if hour_12 == 0:
            hour_12 = 12
        formatted_hourly_sales[f"{hour_12} {period}"] = amount

    return jsonify(
        {
            "peak_hour_sales": (
                f"{peak_hour_sales}:00" if peak_hour_sales is not None else None
            ),
            "peak_hour_transactions": (
                f"{peak_hour_transactions}:00"
                if peak_hour_transactions is not None
                else None
            ),
            "hourly_sales": formatted_hourly_sales,
            "hourly_transactions": hourly_transactions,
        }
    )


@app.route("/predict", methods=["POST"])
@jwt_required()
def predict():
    restaurant_id = get_jwt_identity()
    data = request.json

    # Make sure we have the required data
    required_fields = [
        "day_of_week",
        "hour_of_day",
        "is_weekend",
        "is_holiday",
    ]  # Example fields
    missing_fields = [field for field in required_fields if field not in data]

    if missing_fields:
        return (
            jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}),
            400,
        )

    try:
        X_input = pd.DataFrame([data])  # Convert input JSON to DataFrame

        # Load model - ideally you should have restaurant-specific models
        # or at least ensure the model is trained on data from this restaurant
        with open("sales_model.pkl", "rb") as f:
            model = pickle.load(f)

        prediction = model.predict(X_input)

        return jsonify(
            {
                "restaurant_id": restaurant_id,
                "predicted_sales": float(prediction[0]),
                "input_parameters": data,
            }
        )
    except Exception as e:
        return jsonify({"error": f"Prediction error: {str(e)}"}), 500


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
@jwt_required()
def insights():
    restaurant_id = get_jwt_identity()

    # Get all payments for this restaurant
    payments = Payment.query.filter_by(restaurant_id=restaurant_id).all()

    if not payments:
        return jsonify({"message": "No payment data found for this restaurant"}), 404

    # Convert to DataFrame for analysis
    data = []
    for payment in payments:
        data.append(
            {
                "order_id": payment.order_id,
                "timestamp": payment.timestamp,
                "item_name": payment.item_name,
                "item_type": payment.item_type,
                "item_price": payment.item_price,
                "quantity": payment.quantity,
                "transaction_amount": payment.transaction_amount,
                "transaction_type": payment.transaction_type,
                "received_by": payment.received_by,
            }
        )

    df = pd.DataFrame(data)

    # Perform time-based analysis
    df["date"] = df["timestamp"].dt.date
    df["hour"] = df["timestamp"].dt.hour
    df["day_of_week"] = df["timestamp"].dt.day_name()
    df["month"] = df["timestamp"].dt.month_name()

    # Generate restaurant-specific insights based on their data
    insights_list = []

    # Top selling items
    top_items = df.groupby("item_name")["quantity"].sum().sort_values(ascending=False)
    if not top_items.empty:
        top_item = top_items.index[0]
        insights_list.append(
            f"Your top selling item is {top_item} with {top_items[0]} units sold."
        )

    # Busiest day of week
    day_sales = (
        df.groupby("day_of_week")["transaction_amount"]
        .sum()
        .sort_values(ascending=False)
    )
    if not day_sales.empty:
        busiest_day = day_sales.index[0]
        insights_list.append(
            f"Your busiest day is {busiest_day} with ${day_sales[0]:.2f} in sales."
        )

    # Busiest hour
    hour_sales = (
        df.groupby("hour")["transaction_amount"].sum().sort_values(ascending=False)
    )
    if not hour_sales.empty:
        busiest_hour = hour_sales.index[0]
        period = "AM" if busiest_hour < 12 else "PM"
        hour_12 = busiest_hour % 12
        if hour_12 == 0:
            hour_12 = 12
        insights_list.append(
            f"Your peak hour is {hour_12} {period} with ${hour_sales[0]:.2f} in sales."
        )

    # Average transaction value
    avg_transaction = df["transaction_amount"].mean()
    insights_list.append(f"Your average transaction value is ${avg_transaction:.2f}.")

    # Sales growth (if data spans multiple months)
    if df["date"].nunique() > 30:
        df["month_year"] = df["timestamp"].dt.to_period("M")
        monthly_sales = df.groupby("month_year")["transaction_amount"].sum()
        if len(monthly_sales) >= 2:
            last_month = monthly_sales.index[-1]
            previous_month = monthly_sales.index[-2]
            growth_rate = (
                (monthly_sales[last_month] - monthly_sales[previous_month])
                / monthly_sales[previous_month]
            ) * 100
            insights_list.append(
                f"Your monthly sales growth is {growth_rate:.1f}% compared to the previous month."
            )

    return jsonify(
        {
            "restaurant_id": restaurant_id,
            "insights": insights_list,
            "data_points": len(df),
            "date_range": {
                "start": df["timestamp"].min().strftime("%Y-%m-%d"),
                "end": df["timestamp"].max().strftime("%Y-%m-%d"),
            },
        }
    )


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
