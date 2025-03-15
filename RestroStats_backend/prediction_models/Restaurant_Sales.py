from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import pickle
import io
import base64
import json
from datetime import datetime
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_squared_error, r2_score
from app import app

# app = Flask(__name__)
CORS(app)

# Custom JSON encoder to handle NumPy types
class NumpyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return super(NumpyEncoder, self).default(obj)

# Configure Flask to use the custom encoder
app.json_encoder = NumpyEncoder

# Load model if it exists, otherwise create it
try:
    with open("sales_model.pkl", "rb") as f:
        model_pipeline = pickle.load(f)
    print("Model loaded successfully!")
    
    # We'll need to recreate these for predictions
    categorical_features = ['item_name', 'item_type', 'day_of_week', 'time_of_day', 'received_by']
    numerical_features = ['item_price']
except:
    print("Model not found, will be created when data is loaded")
    model_pipeline = None
    categorical_features = None
    numerical_features = None

# Load the data
@app.route('/api/load-data', methods=['POST'])
def load_data():
    global model_pipeline, categorical_features, numerical_features
    
    # In a real app, you'd upload the file. For now, we'll use the hardcoded path
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400
    
        file = request.files['file']
        df = pd.read_csv(file)
        df_clean, df_time_analysis = clean_data(df)
        analysis_results = analyze_data(df_clean, df_time_analysis)
        
        # Build prediction model if not already loaded
        if model_pipeline is None:
            model_pipeline, categorical_features, numerical_features = build_prediction_model(df_time_analysis)
        
        return jsonify({
            "success": True,
            "message": "Data loaded and analyzed successfully",
            "data_preview": df.head().to_dict(),
            "data_shape": df.shape
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error loading data: {str(e)}"
        }), 500

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
    
    # Save model
    with open("sales_model.pkl", "wb") as f:
        pickle.dump(model_pipeline, f)
    
    return model_pipeline, categorical_features, numerical_features

# Function to predict sales
def predict_sales(item_name, item_type, day_of_week, time_of_day, received_by, item_price):
    if model_pipeline is None:
        return None, None
        
    input_data = pd.DataFrame({
        'item_name': [item_name],
        'item_type': [item_type],
        'day_of_week': [day_of_week],
        'time_of_day': [time_of_day],
        'received_by': [received_by],
        'item_price': [float(item_price)]
    })
    
    predicted_sales = model_pipeline.predict(input_data[categorical_features + numerical_features])[0]
    predicted_profit = predicted_sales * 0.4
    
    return float(predicted_sales), float(predicted_profit)

# API endpoint to get all analyses
@app.route('/api/get-analysis', methods=['GET'])
def get_analysis():
    try:
        df = pd.read_csv('sample_data.csv')
        df_clean, df_time_analysis = clean_data(df)
        analysis_results = analyze_data(df_clean, df_time_analysis)
        
        # Convert to JSON-compatible format
        # Convert DataFrames to lists of dicts with explicit conversion to Python types
        day_time_sales_records = []
        for idx, row in analysis_results['day_time_sales'].reset_index().iterrows():
            record = {'day_of_week': row['day_of_week']}
            for col in analysis_results['day_time_sales'].columns:
                value = row.get(col)
                if pd.notnull(value):
                    record[col] = float(value)
                else:
                    record[col] = 0.0
            day_time_sales_records.append(record)
        
        favorite_items = []
        for idx, value in analysis_results['favorite_items'].items():
            favorite_items.append({'item_name': idx, 'count': int(value)})
        
        day_sales = []
        for idx, value in analysis_results['day_sales'].items():
            day_sales.append({'day_of_week': idx, 'sales': float(value)})
        
        item_type_sales = []
        for idx, value in analysis_results['item_type_sales'].items():
            item_type_sales.append({'item_type': idx, 'sales': float(value)})
        
        monthly_sales = []
        for idx, value in analysis_results['monthly_sales'].items():
            monthly_sales.append({'month': idx, 'sales': float(value)})
        
        # Format for charting on frontend
        day_sales_chart = {
            'labels': [item['day_of_week'] for item in day_sales],
            'values': [item['sales'] for item in day_sales]
        }
        
        item_type_chart = {
            'labels': [item['item_type'] for item in item_type_sales],
            'values': [item['sales'] for item in item_type_sales]
        }
        
        favorite_items_chart = {
            'labels': [item['item_name'] for item in favorite_items[:10]],
            'values': [item['count'] for item in favorite_items[:10]]
        }
        
        monthly_sales_chart = {
            'labels': [item['month'] for item in monthly_sales],
            'values': [item['sales'] for item in monthly_sales]
        }
        
        # Create heatmap data format
        heatmap_data = []
        for day in df_time_analysis['day_of_week'].unique():
            for time in ['Morning', 'Afternoon', 'Evening', 'Night']:
                filtered = df_time_analysis[(df_time_analysis['day_of_week'] == day) & 
                                            (df_time_analysis['time_of_day'] == time)]
                if not filtered.empty:
                    heatmap_data.append({
                        'day': day,
                        'time': time,
                        'value': float(filtered['transaction_amount'].sum())
                    })
        
        return jsonify({
            'success': True,
            'day_sales': day_sales_chart,
            'item_type_sales': item_type_chart,
            'favorite_items': favorite_items_chart,
            'monthly_sales': monthly_sales_chart,
            'heatmap_data': heatmap_data,
            'raw_data': {
                'day_sales': day_sales,
                'item_type_sales': item_type_sales,
                'favorite_items': favorite_items[:10],
                'monthly_sales': monthly_sales
            }
        })
    except Exception as e:
        import traceback
        return jsonify({
            'success': False,
            'message': f"Error getting analysis: {str(e)}",
            'traceback': traceback.format_exc()
        }), 500

# API endpoint for predictions
@app.route('/api/predict', methods=['POST'])
def make_prediction():
    try:
        data = request.json
        
        item_name = data.get('item_name', 'Vadapav')
        item_type = data.get('item_type', 'Fastfood')
        day_of_week = data.get('day_of_week', 'Monday')
        time_of_day = data.get('time_of_day', 'Evening')
        received_by = data.get('received_by', 'Mr.')
        item_price = float(data.get('item_price', 20))
        
        # Get predictions for all days of the week
        days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        predictions = []
        
        for day in days:
            predicted_sales, predicted_profit = predict_sales(
                item_name, item_type, day, time_of_day, received_by, item_price
            )
            predictions.append({
                'day': day,
                'sales': round(float(predicted_sales), 2),
                'profit': round(float(predicted_profit), 2)
            })
        
        # Get predictions for all times of day
        times = ['Morning', 'Afternoon', 'Evening', 'Night']
        time_predictions = []
        
        for time in times:
            predicted_sales, predicted_profit = predict_sales(
                item_name, item_type, day_of_week, time, received_by, item_price
            )
            time_predictions.append({
                'time': time,
                'sales': round(float(predicted_sales), 2),
                'profit': round(float(predicted_profit), 2)
            })
        
        # Format for charts
        day_prediction_chart = {
            'labels': [p['day'] for p in predictions],
            'sales': [p['sales'] for p in predictions],
            'profit': [p['profit'] for p in predictions]
        }
        
        time_prediction_chart = {
            'labels': [p['time'] for p in time_predictions],
            'sales': [p['sales'] for p in time_predictions],
            'profit': [p['profit'] for p in time_predictions]
        }
        
        return jsonify({
            'success': True,
            'day_predictions': day_prediction_chart,
            'time_predictions': time_prediction_chart,
            'single_prediction': {
                'sales': predictions[days.index(day_of_week)]['sales'],
                'profit': predictions[days.index(day_of_week)]['profit']
            }
        })
    except Exception as e:
        import traceback
        return jsonify({
            'success': False,
            'message': f"Error making prediction: {str(e)}",
            'traceback': traceback.format_exc()
        }), 500

# Get available options for predictions
@app.route('/api/get-options', methods=['GET'])
def get_options():
    try:
        df = pd.read_csv('sample_data.csv')
        
        return jsonify({
            'success': True,
            'items': df['item_name'].unique().tolist(),
            'item_types': df['item_type'].unique().tolist(),
            'days': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            'times': ['Morning', 'Afternoon', 'Evening', 'Night'],
            'customer_types': df['received_by'].unique().tolist()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f"Error getting options: {str(e)}"
        }), 500