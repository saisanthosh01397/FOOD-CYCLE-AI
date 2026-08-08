import pandas as pd
import numpy as np
import os
import joblib
from sklearn.preprocessing import LabelEncoder, StandardScaler

RAW_DIR = "../../datasets/raw"
PROC_DIR = "../../datasets/processed"
MODELS_DIR = "../../models/saved_models"
os.makedirs(PROC_DIR, exist_ok=True)
os.makedirs(MODELS_DIR, exist_ok=True)

def preprocess_daily_food_waste():
    print("Preprocessing Daily Food Waste...")
    df = pd.read_csv(os.path.join(RAW_DIR, "daily_food_waste.csv"))
    
    # Validation & Cleaning
    df.drop_duplicates(inplace=True)
    df.dropna(inplace=True)
    
    # Ensure types
    df['date'] = pd.to_datetime(df['date'])
    df['food_wasted_kg'] = df['food_wasted_kg'].astype(float)
    
    # Save processed
    df.to_csv(os.path.join(PROC_DIR, "daily_food_waste_clean.csv"), index=False)
    print(f"Daily Food Waste clean shape: {df.shape}")

def preprocess_recovery_data():
    print("Preprocessing Recovery Data...")
    df = pd.read_csv(os.path.join(RAW_DIR, "recovery_data.csv"))
    
    # Validation & Cleaning
    df.drop_duplicates(inplace=True)
    df.dropna(inplace=True)
    
    # Ensure valid ranges
    df = df[df['weight'] > 0]
    df = df[(df['moisture'] >= 0) & (df['moisture'] <= 100)]
    df = df[(df['freshness'] >= 0) & (df['freshness'] <= 100)]
    df = df[(df['contamination_level'] >= 0) & (df['contamination_level'] <= 100)]
    
    # Preprocessing artifacts
    le = LabelEncoder()
    df['food_category_encoded'] = le.fit_transform(df['food_category'])
    
    numeric_features = ['weight', 'moisture', 'freshness', 'contamination_level', 'organic_percentage']
    scaler = StandardScaler()
    df[numeric_features] = scaler.fit_transform(df[numeric_features])
    
    # Save preprocessing artifacts
    joblib.dump(le, os.path.join(MODELS_DIR, "label_encoder_v1.pkl"))
    joblib.dump(scaler, os.path.join(MODELS_DIR, "scaler_v1.pkl"))
    
    # Save processed
    df.to_csv(os.path.join(PROC_DIR, "recovery_data_clean.csv"), index=False)
    print(f"Recovery Data clean shape: {df.shape}")

def preprocess_sustainability_data():
    print("Preprocessing Sustainability Data...")
    df = pd.read_csv(os.path.join(RAW_DIR, "sustainability_data.csv"))
    
    df.drop_duplicates(inplace=True)
    df.dropna(inplace=True)
    
    df.to_csv(os.path.join(PROC_DIR, "sustainability_data_clean.csv"), index=False)
    print(f"Sustainability Data clean shape: {df.shape}")

if __name__ == "__main__":
    preprocess_daily_food_waste()
    preprocess_recovery_data()
    preprocess_sustainability_data()
    print("Data Preprocessing complete.")
