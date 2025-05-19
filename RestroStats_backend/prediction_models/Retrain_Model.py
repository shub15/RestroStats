import mysql.connector
import pickle
from repository.Load_New_Data import new_data

def retrain_model():
    if not new_data.empty:
        categorical_features = [
            "item_name",
            "item_type",
            "day_of_week",
            "time_of_day",
            "received_by",
        ]
        numerical_features = ["item_price"]
        X_new = new_data[categorical_features + numerical_features]
        y_new = new_data['transaction_amount']

        # Load existing model
        with open("sales_model.pkl", "rb") as f:
            model = pickle.load(f)

        model.fit(X_new, y_new)  # Incremental Training

        # Save updated model
        with open("sales_model.pkl", "wb") as f:
            pickle.dump(model, f)

        # Update last trained timestamp
        conn = mysql.connector.connect(host="localhost", user="root", password="root", database="restaurant_db")
        cursor = conn.cursor()
        cursor.execute(f"INSERT INTO model_metadata (last_trained) VALUES (NOW())")
        conn.commit()
        conn.close()
