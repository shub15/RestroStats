import pandas as pd

# Load the uploaded CSV file
file_path = "E:/Users/Documents/College/Engineering/S.Y. Eng/Sem 4/PBL/archive/Balaji Fast Food Sales - Copy.csv"
df = pd.read_csv(file_path)

# Display the first few rows to understand its structure
df.head()

# Define a function to standardize timestamps
def clean_timestamp(date_str):
    try:
        return pd.to_datetime(date_str, errors='coerce', dayfirst=False)
    except Exception:
        return None

# Apply function to clean timestamp column
df['timestamp'] = df['timestamp'].apply(clean_timestamp)

# Mapping time_of_sale to approximate hours
time_mapping = {
    "Morning": "08:00:00",
    "Afternoon": "14:00:00",
    "Evening": "18:00:00",
    "Night": "22:00:00"
}

# Replace time_of_sale with mapped time values
df['time_of_sale'] = df['time_of_sale'].map(time_mapping)

# Combine timestamp and time_of_sale into a single datetime column
df['timestamp'] = df['timestamp'].astype(str) + " " + df['time_of_sale'].astype(str)
df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce')

# Drop original time_of_sale column
df = df.drop(columns=['time_of_sale'])

# Display cleaned data
df.head()
