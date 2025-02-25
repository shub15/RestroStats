from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from db.Features import df
import pickle

X = df[['hour_of_day', 'day_of_week', 'item_price']]  # Features
y = df['transaction_amount']  # Target

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = LinearRegression()
model.fit(X_train, y_train)

# Save model
with open("sales_model.pkl", "wb") as f:
    pickle.dump(model, f)
