import pandas as pd
import numpy as np
import os
import joblib
import json
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
import xgboost as xgb
from sklearn.model_selection import train_test_split, cross_val_score, TimeSeriesSplit, RandomizedSearchCV
from sklearn.metrics import mean_absolute_error, mean_squared_error, mean_absolute_percentage_error, r2_score
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import LabelEncoder, StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
try:
    import shap
except ImportError:
    shap = None

PROC_DIR = "../../datasets/processed"
MODELS_DIR = "../../models/saved_models"
REPORTS_DIR = "../../docs/model_reports"
os.makedirs(REPORTS_DIR, exist_ok=True)
os.makedirs(MODELS_DIR, exist_ok=True)

def train_waste_prediction():
    print("Training Tabular Regression Model for Waste Prediction...")
    df = pd.read_csv(os.path.join(PROC_DIR, "daily_food_waste_clean.csv"))
    
    # 1. Feature Engineering
    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values('date').reset_index(drop=True)
    
    # Create target
    target = 'food_wasted_kg'
    
    # Features
    # Note: 'food_prepared_kg' and 'food_consumed_kg' would be data leakage because we won't know them in advance.
    features_num = ['people_served', 'temperature', 'rainfall']
    features_cat = ['day_of_week', 'month', 'meal_type', 'festival', 'special_event']
    
    # 2. Chronological Splitting (Last 20% for test)
    split_idx = int(len(df) * 0.8)
    train_df = df.iloc[:split_idx]
    test_df = df.iloc[split_idx:]
    
    X_train = train_df[features_num + features_cat]
    y_train = train_df[target]
    
    X_test = test_df[features_num + features_cat]
    y_test = test_df[target]
    
    # 3. Baseline Model (Median of training data by meal_type and day_of_week)
    baseline_medians = train_df.groupby(['meal_type', 'day_of_week'])[target].median().reset_index()
    baseline_medians.rename(columns={target: 'baseline_pred'}, inplace=True)
    
    test_baseline = pd.merge(test_df, baseline_medians, on=['meal_type', 'day_of_week'], how='left')
    # Fill any missing combinations with global median
    global_median = train_df[target].median()
    test_baseline['baseline_pred'] = test_baseline['baseline_pred'].fillna(global_median)
    
    preds_base = test_baseline['baseline_pred'].values
    mae_base = mean_absolute_error(y_test, preds_base)
    rmse_base = np.sqrt(mean_squared_error(y_test, preds_base))
    r2_base = r2_score(y_test, preds_base)
    mape_base = mean_absolute_percentage_error(y_test, preds_base)
    
    # 4. Preprocessing Pipeline
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), features_num),
            ('cat', OneHotEncoder(handle_unknown='ignore'), features_cat)
        ])
    
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', xgb.XGBRegressor(random_state=42, objective='reg:squarederror'))
    ])
    
    # 5. Hyperparameter Tuning using TimeSeriesSplit
    param_distributions = {
        'regressor__n_estimators': [50, 100, 200],
        'regressor__max_depth': [3, 5, 7],
        'regressor__learning_rate': [0.01, 0.05, 0.1],
        'regressor__subsample': [0.8, 1.0]
    }
    
    tscv = TimeSeriesSplit(n_splits=3)
    
    search = RandomizedSearchCV(
        pipeline, 
        param_distributions=param_distributions, 
        n_iter=10, 
        cv=tscv, 
        scoring='neg_mean_absolute_error',
        random_state=42,
        n_jobs=-1
    )
    
    search.fit(X_train, y_train)
    best_model = search.best_estimator_
    
    # 6. Final Evaluation on Untouched Test Set
    preds_final = best_model.predict(X_test)
    
    mae_final = mean_absolute_error(y_test, preds_final)
    rmse_final = np.sqrt(mean_squared_error(y_test, preds_final))
    r2_final = r2_score(y_test, preds_final)
    mape_final = mean_absolute_percentage_error(y_test, preds_final)
    
    report = f"""# Waste Prediction Model Quality Report

## 1. Dataset Description
- **Dataset**: `daily_food_waste_clean.csv`
- **Rows**: {len(df)} (Train: {len(X_train)}, Test: {len(X_test)})
- **Limitation**: **100% Synthetic Data**. The data was programmatically generated via `1_generate_datasets.py`. As a result, performance metrics reflect the model's ability to reverse-engineer the generation logic, not real-world human behavior.

## 2. Prediction Target & Features
- **Target**: `{target}` (Continuous variable, kg of wasted food)
- **Features Used**: {', '.join(features_num + features_cat)}
- **Leakage Check**: `food_prepared_kg` and `food_consumed_kg` were explicitly excluded to prevent target leakage, as they represent future/concurrent information.

## 3. Validation Methodology
- **Split Strategy**: Strictly chronological (last 20% held out as test set).
- **Cross-Validation**: `TimeSeriesSplit` used during hyperparameter tuning to prevent future data from leaking into past evaluations.

## 4. Hyperparameter Tuning
- **Method**: RandomizedSearchCV
- **Best Parameters**: {search.best_params_}

## 5. Evaluation Metrics
| Metric | Naive Baseline (Median) | Final Model (XGBoost) |
|---|---|---|
| MAE | {mae_base:.2f} | {mae_final:.2f} |
| RMSE | {rmse_base:.2f} | {rmse_final:.2f} |
| R² | {r2_base:.2f} | {r2_final:.2f} |
| MAPE | {mape_base:.2f} | {mape_final:.2f} |

"""
    
    with open(os.path.join(REPORTS_DIR, "prediction_model_report.md"), "w") as f:
        f.write(report)
        
    joblib.dump(best_model, os.path.join(MODELS_DIR, "waste_prediction_model_v2.pkl"))
    print("Tabular Regression Model saved.")
    
    # Error Analysis Plot
    plt.figure(figsize=(10,6))
    plt.scatter(y_test, preds_final, alpha=0.5)
    plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--')
    plt.xlabel('Actual Waste (kg)')
    plt.ylabel('Predicted Waste (kg)')
    plt.title('Error Analysis: Actual vs Predicted')
    plt.tight_layout()
    plt.savefig(os.path.join(REPORTS_DIR, "waste_prediction_error.png"))
    plt.close()
    
    # Feature Importance (SHAP or XGBoost built-in)
    try:
        # Get feature names after OneHotEncoding
        ohe_cols = preprocessor.named_transformers_['cat'].get_feature_names_out(features_cat)
        all_features = features_num + list(ohe_cols)
        
        xgb_regressor = best_model.named_steps['regressor']
        importances = xgb_regressor.feature_importances_
        
        # Sort and plot top 10
        indices = np.argsort(importances)[-10:]
        plt.figure(figsize=(10,6))
        plt.barh(range(len(indices)), importances[indices], align='center')
        plt.yticks(range(len(indices)), [all_features[i] for i in indices])
        plt.title('Top 10 Feature Importances')
        plt.tight_layout()
        plt.savefig(os.path.join(REPORTS_DIR, "waste_prediction_importance.png"))
        plt.close()
    except Exception as e:
        print(f"Failed to generate feature importance plot: {e}")

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
    train_waste_prediction()
    train_recovery_models()
    train_npk_models()
    print("Model Training complete.")
