import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime

# Visualization and analysis of sales data
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
