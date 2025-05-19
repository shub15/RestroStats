import os
import pickle

import pandas as pd

# from sklearn.model_selection import train_test_split
# from sklearn.ensemble import RandomForestRegressor
# from sklearn.preprocessing import OneHotEncoder
# from sklearn.compose import ColumnTransformer
# from sklearn.pipeline import Pipeline
# from sklearn.metrics import mean_squared_error, r2_score

from app import app, db

# from prediction_models.Retrain_Model import Retrain_Model 

# --- Data Loading ---
with app.app_context():
    engine = db.engine
    df = pd.read_sql_query("SELECT * FROM payments", engine)
    print(df.head())

if df.empty:
    fallback_file = "sample_data.csv"
    if os.path.exists(fallback_file):
        try:
            df = pd.read_csv(fallback_file)
            print(f"Fallback: Loaded data from {fallback_file}")
        except Exception as e:
            print(f"Error loading {fallback_file}: {e}")
            # Create an empty DataFrame with expected columns
            df = pd.DataFrame(
                columns=[
                    "timestamp",
                    "transaction_type",
                    "transaction_amount",
                    "item_name",
                    "item_type",
                    "quantity",
                    "item_price",
                    "received_by",
                ]
            )
            print("Using empty DataFrame with default columns")
    else:
        print(f"Fallback file {fallback_file} not found")
        df = pd.DataFrame(
            columns=[
                "timestamp",
                "transaction_type",
                "transaction_amount",
                "item_name",
                "item_type",
                "quantity",
                "item_price",
                "received_by",
            ]
        )
        print("Using empty DataFrame with default columns")
else:
    print("Data fetched from database")


# --- Data Cleaning and Preprocessing ---
def clean_data(df):
    if df.empty:
        print(
            "Warning: Input DataFrame is empty. Returning empty DataFrames with expected structure."
        )
        return df.copy(), df.copy()

    df_clean = df.copy()
    df_clean["timestamp"] = pd.to_datetime(
        df_clean["timestamp"], format="%d-%m-%Y %H:%M", errors="coerce"
    )
    df_time_analysis = df_clean.dropna(subset=["timestamp"]).copy()

    if not df_time_analysis.empty:
        df_time_analysis["day_of_week"] = df_time_analysis["timestamp"].dt.day_name()
        df_time_analysis["month"] = df_time_analysis["timestamp"].dt.month_name()
        df_time_analysis["hour"] = df_time_analysis["timestamp"].dt.hour

        time_of_day_map = {8: "Morning", 14: "Afternoon", 18: "Evening", 22: "Night"}
        df_time_analysis["time_of_day"] = df_time_analysis["hour"].map(time_of_day_map)

    mode = df_clean["transaction_type"].mode()
    fill_value = mode[0] if not mode.empty else "Unknown"
    df_clean["transaction_type"] = df_clean["transaction_type"].fillna(fill_value)

    return df_clean, df_time_analysis


# --- Data Analysis ---
def analyze_data(df_clean, df_time_analysis):
    if df_clean.empty or df_time_analysis.empty:
        print(
            "Warning: Empty data provided for analysis. Returning empty analysis results."
        )
        return {
            "day_time_sales": pd.DataFrame(),
            "favorite_items": pd.Series(dtype="float64"),
            "day_sales": pd.Series(dtype="float64"),
            "item_type_sales": pd.Series(dtype="float64"),
            "monthly_sales": pd.Series(dtype="float64"),
            "customer_time_preference": pd.DataFrame(),
        }

    day_time_sales = (
        df_time_analysis.groupby(["day_of_week", "time_of_day"])["transaction_amount"]
        .sum()
        .unstack()
    )
    favorite_items = (
        df_clean.groupby("item_name")["quantity"].sum().sort_values(ascending=False)
    )
    day_sales = (
        df_time_analysis.groupby("day_of_week")["transaction_amount"]
        .sum()
        .sort_values(ascending=False)
    )
    item_type_sales = df_clean.groupby("item_type")["transaction_amount"].sum()
    monthly_sales = df_time_analysis.groupby("month")["transaction_amount"].sum()
    customer_time_preference = (
        df_time_analysis.groupby(["time_of_day", "received_by"]).size().unstack()
    )
    df_clean["profit"] = df_clean["transaction_amount"] * 0.4

    return {
        "day_time_sales": day_time_sales,
        "favorite_items": favorite_items,
        "day_sales": day_sales,
        "item_type_sales": item_type_sales,
        "monthly_sales": monthly_sales,
        "customer_time_preference": customer_time_preference,
    }


# --- Prediction Model ---
# def build_prediction_model(df_time_analysis):
    if df_time_analysis.empty:
        print(
            "Warning: Empty data provided for model building. Skipping model training."
        )
        return None, [], []

    model_df = df_time_analysis.copy()
    categorical_features = [
        "item_name",
        "item_type",
        "day_of_week",
        "time_of_day",
        "received_by",
    ]
    numerical_features = ["item_price"]

    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features)
        ],
        remainder="passthrough",
    )

    model_pipeline = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("model", RandomForestRegressor(n_estimators=100, random_state=42)),
        ]
    )

    X = model_df[categorical_features + numerical_features]
    y = model_df["transaction_amount"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    model_pipeline.fit(X_train, y_train)

    y_pred = model_pipeline.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    print("Model Evaluation:")
    print(f"Mean Squared Error: {mse:.2f}")
    print(f"R² Score: {r2:.2f}")

    with open("sales_model.pkl", "wb") as f:
        pickle.dump(model_pipeline, f)

    return model_pipeline, categorical_features, numerical_features


# --- Sales Prediction ---
def predict_sales(
    model,
    item_name,
    item_type,
    day_of_week,
    time_of_day,
    received_by,
    item_price,
    cat_features,
    num_features,
):
    if model is None:
        print("Warning: No model available for prediction.")
        return 0.0, 0.0

    input_data = pd.DataFrame(
        {
            "item_name": [item_name],
            "item_type": [item_type],
            "day_of_week": [day_of_week],
            "time_of_day": [time_of_day],
            "received_by": [received_by],
            "item_price": [item_price],
        }
    )

    predicted_sales = model.predict(input_data[cat_features + num_features])[0]
    predicted_profit = predicted_sales * 0.4

    return predicted_sales, predicted_profit


# --- Generate Insights ---
def generate_insights(df_clean, df_time_analysis):
    insights = []

    if df_clean.empty or df_time_analysis.empty:
        insights.append("⚠️ No data available to generate insights.")
        return insights, None

    # 1. Low-performing day
    day_sales = df_time_analysis.groupby("day_of_week")["transaction_amount"].sum()
    if not day_sales.empty:
        low_day = day_sales.idxmin()
        low_day_amount = day_sales.min()
        insights.append(
            f"The lowest sales occur on {low_day}, totaling Rs. {low_day_amount:.2f}. "
            "You can consider giving staff a break or operating half-day."
        )

    # 2. High-performing time slot
    time_sales = df_time_analysis.groupby("time_of_day")["transaction_amount"].sum()
    if not time_sales.empty:
        best_time = time_sales.idxmax()
        best_time_amount = time_sales.max()
        insights.append(
            f"Peak business happens in the {best_time}, with sales reaching Rs. {best_time_amount:.2f}. "
            "You can promote special combos during this time."
        )

    # 3. Top-selling item
    top_item_series = df_clean.groupby("item_name")["quantity"].sum()
    if not top_item_series.empty:
        top_item = top_item_series.idxmax()
        top_qty = top_item_series.max()
        insights.append(
            f"The most popular item is {top_item}, sold {top_qty} times. Make sure it's always in stock!"
        )
    else:
        top_item = None

    # 4. Underperforming item
    if not top_item_series.empty:
        bottom_item = top_item_series.idxmin()
        bottom_qty = top_item_series.min()
        if bottom_qty <= 2:
            insights.append(
                f"The item {bottom_item} sold only {bottom_qty} time(s). Consider removing it from the menu."
            )

    # 5. Day-Time combination with low performance
    combo_sales = df_time_analysis.groupby(["day_of_week", "time_of_day"])[
        "transaction_amount"
    ].sum()
    if not combo_sales.empty:
        low_combo = combo_sales.idxmin()
        insights.append(
            f"On {low_combo[0]} {low_combo[1]}, sales are lowest. You might want to run offers to attract more customers."
        )

    return insights, top_item


# --- Main Execution ---
df_clean, df_time_analysis = clean_data(df)
analysis_results = analyze_data(df_clean, df_time_analysis)
# model, cat_features, num_features = build_prediction_model(df_time_analysis)
insights, top_item = generate_insights(df_clean, df_time_analysis)

# --- Retrain Model on New Data  ---
# Retrain_Model.retrain_model()