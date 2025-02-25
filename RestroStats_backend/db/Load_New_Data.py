from sqlalchemy import create_engine
import pandas as pd

# Create SQLAlchemy engine
DATABASE_URL = "mysql+pymysql://root:root@localhost/restaurant_db"
engine = create_engine(DATABASE_URL)

# conn = mysql.connector.connect(host="localhost", user="root", password="root", database="restaurant_db")
query = "SELECT MAX(last_trained) FROM model_metadata"
last_trained = pd.read_sql(query, engine).iloc[0, 0]

query = f"SELECT * FROM Payment WHERE timestamp > '{last_trained}'"
new_data = pd.read_sql(query, engine)

print(new_data.head())