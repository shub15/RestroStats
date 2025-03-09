import mysql.connector

# Replace with your database details
db_config = mysql.connector.connect(
    host = 'localhost',  # or your MySQL server IP
    user = 'vatsal',  # MySQL username
    passwd = 'vatsal',  # MySQL password
    database = 'menu_items'
)
print("Vatsal")

mycursor = db_config.cursor()

mycursor.execute('select * from  items where price = 5')

result = mycursor.fetchall()

for i in result:
    print(i)
