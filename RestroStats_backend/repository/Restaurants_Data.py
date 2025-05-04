from sqlalchemy import create_engine
import pandas as pd

# Create SQLAlchemy engine
DATABASE_URL = "mysql+pymysql://root:root@localhost/restaurant_db"
engine = create_engine(DATABASE_URL)

# conn = mysql.connector.connect(host="localhost", user="root", password="root", database="restaurant_db")
query = "SELECT timestamp, item_name, item_price, quantity, transaction_amount FROM Payments"
df = pd.read_sql(query, engine)

print(df.head())

# engine.close()
