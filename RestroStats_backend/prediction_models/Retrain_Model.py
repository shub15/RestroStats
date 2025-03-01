import mysql.connector
import pickle
from repository.Load_New_Data import new_data

if not new_data.empty:
    X_new = new_data[['hour_of_day', 'day_of_week', 'item_price', 'quantity']]
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
