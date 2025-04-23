import pickle
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_squared_error, r2_score
from app import app, db
from entities.Payment import Payment

# Load the data
# df = pd.read_csv('sample_data.csv')
with app.app_context():
    # Now you're inside the application context
    engine = db.engine

    # Execute SQL query directly
    df = pd.read_sql_query("SELECT * FROM payment", engine)
    
    print(df.head())
    
if df.empty :
    df = pd.read_csv('sample_data.csv')
else :
    print("fetched")

# Data cleaning and preprocessing
def clean_data(df):
    df_clean = df.copy()
    
    df_clean['timestamp'] = pd.to_datetime(df_clean['timestamp'], format='%d-%m-%Y %H:%M', errors='coerce')
    
    df_time_analysis = df_clean.dropna(subset=['timestamp']).copy()
    
    df_time_analysis['day_of_week'] = df_time_analysis['timestamp'].dt.day_name()
    df_time_analysis['month'] = df_time_analysis['timestamp'].dt.month_name()
    df_time_analysis['hour'] = df_time_analysis['timestamp'].dt.hour
    
    time_of_day_map = {
        8: 'Morning',
        14: 'Afternoon',
        18: 'Evening',
        22: 'Night'
    }
    df_time_analysis['time_of_day'] = df_time_analysis['hour'].map(time_of_day_map)
    
    df_clean['transaction_type'] = df_clean['transaction_type'].fillna(df_clean['transaction_type'].mode()[0])
    
    return df_clean, df_time_analysis

# Perform data analysis
def analyze_data(df_clean, df_time_analysis):
    day_time_sales = df_time_analysis.groupby(['day_of_week', 'time_of_day'])['transaction_amount'].sum().unstack()
    
    favorite_items = df_clean.groupby('item_name')['quantity'].sum().sort_values(ascending=False)
    
    day_sales = df_time_analysis.groupby('day_of_week')['transaction_amount'].sum().sort_values(ascending=False)
    
    item_type_sales = df_clean.groupby('item_type')['transaction_amount'].sum()
    
    monthly_sales = df_time_analysis.groupby('month')['transaction_amount'].sum()
    
    customer_time_preference = df_time_analysis.groupby(['time_of_day', 'received_by']).size().unstack()
    
    df_clean['profit'] = df_clean['transaction_amount'] * 0.4
    
    return {
        'day_time_sales': day_time_sales,
        'favorite_items': favorite_items,
        'day_sales': day_sales,
        'item_type_sales': item_type_sales,
        'monthly_sales': monthly_sales,
        'customer_time_preference': customer_time_preference
    }

# Prediction model
def build_prediction_model(df_time_analysis):
    model_df = df_time_analysis.copy()
    
    categorical_features = ['item_name', 'item_type', 'day_of_week', 'time_of_day', 'received_by']
    numerical_features = ['item_price']
    
    # Define preprocessor
    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ],
        remainder='passthrough'
    )
    
    # Define model pipeline
    model_pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('model', RandomForestRegressor(n_estimators=100, random_state=42))
    ])
    
    X = model_df[categorical_features + numerical_features]
    y = model_df['transaction_amount']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model_pipeline.fit(X_train, y_train)
    
    y_pred = model_pipeline.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    print(f"Model Evaluation:")
    print(f"Mean Squared Error: {mse:.2f}")
    print(f"R² Score: {r2:.2f}")

    # Save model
    with open("sales_model.pkl", "wb") as f:
        pickle.dump(model_pipeline, f)
    
    return model_pipeline, categorical_features, numerical_features

# Function to predict sales
def predict_sales(model, item_name, item_type, day_of_week, time_of_day, received_by, item_price, cat_features, num_features):
    input_data = pd.DataFrame({
        'item_name': [item_name],
        'item_type': [item_type],
        'day_of_week': [day_of_week],
        'time_of_day': [time_of_day],
        'received_by': [received_by],
        'item_price': [item_price]
    })
    
    predicted_sales = model.predict(input_data[cat_features + num_features])[0]
    predicted_profit = predicted_sales * 0.4
    
    return predicted_sales, predicted_profit

# Visualize the results
def visualize_results(analysis_results):
    plt.figure(figsize=(15, 20))
    
    # 1. Sales by day of week and time of day
    plt.subplot(3, 2, 1)
    sns.heatmap(analysis_results['day_time_sales'], annot=True, cmap='YlGnBu', fmt='.0f')
    plt.title('Sales by Day of Week and Time of Day')
    
    # 2. Favorite menu items
    plt.subplot(3, 2, 2)
    analysis_results['favorite_items'].head(10).plot(kind='bar')
    plt.title('Top 10 Favorite Menu Items by Quantity Sold')
    plt.ylabel('Quantity Sold')
    plt.xticks(rotation=45)
    
    # 3. Sales by day of week
    plt.subplot(3, 2, 3)
    analysis_results['day_sales'].plot(kind='bar')
    plt.title('Total Sales by Day of Week')
    plt.ylabel('Sales Amount')
    plt.xticks(rotation=45)
    
    # 4. Sales by item type
    plt.subplot(3, 2, 4)
    analysis_results['item_type_sales'].plot(kind='pie', autopct='%1.1f%%')
    plt.title('Sales Distribution by Item Type')
    
    # 5. Monthly trend
    plt.subplot(3, 2, 5)
    analysis_results['monthly_sales'].plot(kind='line', marker='o')
    plt.title('Monthly Sales Trend')
    plt.ylabel('Sales Amount')
    plt.xticks(rotation=45)
    
    # 6. Customer preference by time of day
    plt.subplot(3, 2, 6)
    analysis_results['customer_time_preference'].plot(kind='bar', stacked=True)
    plt.title('Customer Preference by Time of Day')
    plt.ylabel('Number of Orders')
    plt.xticks(rotation=45)
    
    plt.tight_layout()
    plt.savefig('sales_analysis_results.png')
    plt.close()
    
df_clean, df_time_analysis = clean_data(df)
analysis_results = analyze_data(df_clean, df_time_analysis)
    
def generate_insights(df_clean, df_time_analysis):
    insights = []

    # 1. Low-performing day
    day_sales = df_time_analysis.groupby('day_of_week')['transaction_amount'].sum()
    low_day = day_sales.idxmin()
    low_day_amount = day_sales.min()
    insights.append(f"📉 The lowest sales occur on {low_day}, totaling Rs. {low_day_amount:.2f}. You can consider giving staff a break or operating half-day.")

    # 2. High-performing time slot
    time_sales = df_time_analysis.groupby('time_of_day')['transaction_amount'].sum()
    best_time = time_sales.idxmax()
    best_time_amount = time_sales.max()
    insights.append(f"🔥 Peak business happens in the {best_time}, with sales reaching Rs. {best_time_amount:.2f}. You can promote special combos during this time.")

    # 3. Top-selling item
    top_item = df_clean.groupby('item_name')['quantity'].sum().idxmax()
    top_qty = df_clean.groupby('item_name')['quantity'].sum().max()
    insights.append(f"🏆 The most popular item is {top_item}, sold {top_qty} times. Make sure it's always in stock!")

    # 4. Underperforming item
    bottom_item = df_clean.groupby('item_name')['quantity'].sum().idxmin()
    bottom_qty = df_clean.groupby('item_name')['quantity'].sum().min()
    if bottom_qty <= 2:
        insights.append(f"❌ The item {bottom_item} sold only {bottom_qty} time(s). Consider removing it from the menu.")

    # 5. Day-Time combination with low performance
    combo_sales = df_time_analysis.groupby(['day_of_week', 'time_of_day'])['transaction_amount'].sum()
    low_combo = combo_sales.idxmin()
    insights.append(f"📉 On {low_combo[0]} {low_combo[1]}, sales are lowest. You might want to run offers to attract more customers.")

    return insights, top_item

def main():
    print("Loading and cleaning data...")
    df_clean, df_time_analysis = clean_data(df)
    
    print("\nPerforming data analysis...")
    analysis_results = analyze_data(df_clean, df_time_analysis)
    
    print("\nSales by Day of Week and Time of Day:")
    print(analysis_results['day_time_sales'])
    
    print("\nTop 5 Favorite Menu Items:")
    print(analysis_results['favorite_items'].head(5))
    
    print("\nSales by Day of Week:")
    print(analysis_results['day_sales'])
    
    print("\nBuilding prediction model...")
    model, cat_features, num_features = build_prediction_model(df_time_analysis)
    
    print("\nVisualizing results...")
    visualize_results(analysis_results)
    
    print("\nExample of sales prediction:")
    predicted_sales, predicted_profit = predict_sales(
        model, 
        'Vadapav', 
        'Fastfood', 
        'Monday', 
        'Evening', 
        'Mr.', 
        20, 
        cat_features, 
        num_features
    )
    
    print(f"Predicted sales for Vadapav on Monday evening: Rs. {predicted_sales:.2f}")
    print(f"Predicted profit: Rs. {predicted_profit:.2f}")
    
    print("\nGenerating business insights...")
    generate_insights(analysis_results)

    
    # Interactive prediction
    def interactive_prediction():
        print("\n--- Sales Prediction Tool ---")
        print("Available menu items: Vadapav, Panipuri, Aalopuri, Frankie, Sandwich, Cold coffee, Sugarcane juice")
        print("Available item types: Fastfood, Beverages")
        print("Available days: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday")
        print("Available times: Morning, Afternoon, Evening, Night")
        print("Available customer types: Mr., Mrs.")
        
        item_name = input("Enter menu item: ")
        item_type = input("Enter item type (Fastfood/Beverages): ")
        day_of_week = input("Enter day of week: ")
        time_of_day = input("Enter time of day (Morning/Afternoon/Evening/Night): ")
        received_by = input("Enter customer type (Mr./Mrs.): ")
        
        # Get item price from the dataset
        item_price = df[df['item_name'] == item_name]['item_price'].iloc[0] if len(df[df['item_name'] == item_name]) > 0 else 0
        
        if item_price == 0:
            print("Item not found in database. Please enter the price manually.")
            item_price = float(input("Enter item price: "))
        
        predicted_sales, predicted_profit = predict_sales(
            model, 
            item_name, 
            item_type, 
            day_of_week, 
            time_of_day, 
            received_by, 
            item_price, 
            cat_features, 
            num_features
        )
        
        print(f"\nPredicted sales for {item_name} on {day_of_week} {time_of_day.lower()}: Rs. {predicted_sales:.2f}")
        print(f"Predicted profit: Rs. {predicted_profit:.2f}")
        
        another = input("\nMake another prediction? (y/n): ")
        if another.lower() == 'y':
            interactive_prediction()
    
    run_interactive = input("\nWould you like to make predictions interactively? (y/n): ")
    if run_interactive.lower() == 'y':
        interactive_prediction()
    
    print("\nAnalysis complete! Check 'sales_analysis_results.png' for visualizations.")

if __name__ == "__main__":
    main()
