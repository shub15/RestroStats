from app import app, db

def init_db():
    with app.app_context():
        tables = db.Model.metadata.tables.keys()
        print(f"Tables to be created: {list(tables)}")
        
        db.create_all()
        print("Database tables created successfully.")
        
if __name__ == '__main__':
    init_db()
    # app.run(debug=True)
    app.run()