import pandas as pd
import numpy as np
import os
import joblib
from prophet import Prophet
from sklearn.ensemble import RandomForestClassifier
import xgboost as xgb
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import mean_absolute_error, mean_squared_error, mean_absolute_percentage_error, accuracy_score, precision_score, recall_score, f1_score, r2_score, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import LabelEncoder

PROC_DIR = "../../datasets/processed"
MODELS_DIR = "../../models/saved_models"
REPORTS_DIR = "../../docs/model_reports"
os.makedirs(REPORTS_DIR, exist_ok=True)

def train_prophet():
    print("Training Prophet Model...")
    df = pd.read_csv(os.path.join(PROC_DIR, "daily_food_waste_clean.csv"))
    
    # Prophet requires 'ds' (datetime) and 'y' (target)
    # Let's aggregate by day since Prophet models time series
    daily_df = df.groupby('date')['food_wasted_kg'].sum().reset_index()
    daily_df.rename(columns={'date': 'ds', 'food_wasted_kg': 'y'}, inplace=True)
    
    # Split into train/test (last 30 days for testing)
    train = daily_df.iloc[:-30]
    test = daily_df.iloc[-30:]
    
    model = Prophet(yearly_seasonality=True, weekly_seasonality=True)
    model.fit(train)
    
    # Evaluate
    future = model.make_future_dataframe(periods=30)
    forecast = model.predict(future)
    preds = forecast['yhat'].iloc[-30:].values
    actuals = test['y'].values
    
    mae = mean_absolute_error(actuals, preds)
    rmse = np.sqrt(mean_squared_error(actuals, preds))
    mape = mean_absolute_percentage_error(actuals, preds)
    
    report = f"### Prophet Model Evaluation\n- MAE: {mae:.2f}\n- RMSE: {rmse:.2f}\n- MAPE: {mape:.2f}\n"
    with open(os.path.join(REPORTS_DIR, "prophet_report.md"), "w") as f:
        f.write(report)
        
    joblib.dump(model, os.path.join(MODELS_DIR, "prophet_model_v1.pkl"))
    print("Prophet Model saved.")

def train_recovery_models():
    print("Training Recovery Classification Models...")
    df = pd.read_csv(os.path.join(PROC_DIR, "recovery_data_clean.csv"))
    
    features = ['food_category_encoded', 'weight', 'moisture', 'freshness', 'contamination_level', 'organic_percentage']
    X = df[features]
    
    # Encode target
    le_target = LabelEncoder()
    y = le_target.fit_transform(df['recommended_method'])
    joblib.dump(le_target, os.path.join(MODELS_DIR, "target_encoder_v1.pkl"))
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # 1. Random Forest
    rf = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_cv = cross_val_score(rf, X_train, y_train, cv=5, scoring='accuracy')
    rf.fit(X_train, y_train)
    rf_preds = rf.predict(X_test)
    rf_acc = accuracy_score(y_test, rf_preds)
    
    # 2. XGBoost
    xgb_model = xgb.XGBClassifier(use_label_encoder=False, eval_metric='mlogloss', random_state=42)
    xgb_cv = cross_val_score(xgb_model, X_train, y_train, cv=5, scoring='accuracy')
    xgb_model.fit(X_train, y_train)
    xgb_preds = xgb_model.predict(X_test)
    xgb_acc = accuracy_score(y_test, xgb_preds)
    
    # Select Best Model
    if xgb_acc > rf_acc:
        best_model = xgb_model
        best_name = "XGBoost"
        preds = xgb_preds
    else:
        best_model = rf
        best_name = "RandomForest"
        preds = rf_preds
        
    # Final Metrics
    acc = accuracy_score(y_test, preds)
    prec = precision_score(y_test, preds, average='weighted')
    rec = recall_score(y_test, preds, average='weighted')
    f1 = f1_score(y_test, preds, average='weighted')
    
    # Feature Importance Plot
    if best_name == "RandomForest":
        importances = best_model.feature_importances_
    else:
        importances = best_model.feature_importances_
        
    plt.figure(figsize=(8,5))
    sns.barplot(x=importances, y=features)
    plt.title(f"Feature Importance ({best_name})")
    plt.savefig(os.path.join(REPORTS_DIR, "feature_importance.png"))
    plt.close()
    
    # Confusion Matrix
    cm = confusion_matrix(y_test, preds)
    plt.figure(figsize=(6,5))
    sns.heatmap(cm, annot=True, fmt='d', xticklabels=le_target.classes_, yticklabels=le_target.classes_)
    plt.title("Confusion Matrix")
    plt.xlabel("Predicted")
    plt.ylabel("Actual")
    plt.savefig(os.path.join(REPORTS_DIR, "confusion_matrix.png"))
    plt.close()
    
    report = f"### Recovery Model Evaluation ({best_name} won)\n"
    report += f"- Cross-Val Accuracy (RF): {rf_cv.mean():.4f}\n"
    report += f"- Cross-Val Accuracy (XGB): {xgb_cv.mean():.4f}\n"
    report += f"- Test Accuracy: {acc:.4f}\n"
    report += f"- Precision: {prec:.4f}\n"
    report += f"- Recall: {rec:.4f}\n"
    report += f"- F1-Score: {f1:.4f}\n"
    
    with open(os.path.join(REPORTS_DIR, "recovery_report.md"), "w") as f:
        f.write(report)
        
    joblib.dump(best_model, os.path.join(MODELS_DIR, "recovery_model_v1.pkl"))
    print(f"Recovery Model ({best_name}) saved.")

def train_npk_models():
    print("Training NPK Regression Models...")
    df = pd.read_csv(os.path.join(PROC_DIR, "recovery_data_clean.csv"))
    
    features = ['food_category_encoded', 'weight', 'moisture', 'freshness', 'contamination_level', 'organic_percentage']
    targets = ['nitrogen', 'phosphorus', 'potassium']
    
    X = df[features]
    y = df[targets]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Multi-output regression is supported by XGBRegressor
    model = xgb.XGBRegressor(random_state=42)
    model.fit(X_train, y_train)
    
    preds = model.predict(X_test)
    
    mae = mean_absolute_error(y_test, preds, multioutput='raw_values')
    rmse = np.sqrt(mean_squared_error(y_test, preds, multioutput='raw_values'))
    r2 = r2_score(y_test, preds, multioutput='raw_values')
    
    report = "### NPK Estimation Model (XGBoost)\n"
    for i, t in enumerate(targets):
        report += f"**{t.capitalize()}** -> MAE: {mae[i]:.4f}, RMSE: {rmse[i]:.4f}, R2: {r2[i]:.4f}\n"
        
    with open(os.path.join(REPORTS_DIR, "npk_report.md"), "w") as f:
        f.write(report)
        
    joblib.dump(model, os.path.join(MODELS_DIR, "npk_model_v1.pkl"))
    print("NPK Model saved.")

if __name__ == "__main__":
    train_prophet()
    train_recovery_models()
    train_npk_models()
    print("Model Training complete.")
