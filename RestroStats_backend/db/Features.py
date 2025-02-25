import pandas as pd

# Sample DataFrame with timestamps
data = {
    "payment_id": [1, 2, 3, 4, 5],
    "timestamp": [
        "2024-02-14 12:45:30",
        "2024-02-14 18:20:15",
        "2024-02-15 09:10:05",
        "2024-02-16 23:50:45",
        "2024-02-17 07:30:00"
    ],
    "item_price": [
        "200","200","200","200","200"
    ],
    "quantity":[
        "2","2","2","2","2"
    ],
    "transaction_amount":[
        "400","400","400","400","400"
    ]
}

df = pd.DataFrame(data)

# Convert timestamp column to datetime format
df["timestamp"] = pd.to_datetime(df["timestamp"])

# Feature Engineering
df["day_of_week"] = df["timestamp"].dt.dayofweek  # Monday=0, Sunday=6
df["hour_of_day"] = df["timestamp"].dt.hour
df["month"] = df["timestamp"].dt.month
df["day_of_month"] = df["timestamp"].dt.day
df["is_weekend"] = df["day_of_week"].apply(lambda x: 1 if x >= 5 else 0)  # 1 if Sat/Sun, else 0

# Drop the original timestamp column if not needed
df.drop(columns=["timestamp"], inplace=True)

# Print the transformed DataFrame
print(df)
