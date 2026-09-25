# Waste Prediction Model Quality Report

## 1. Dataset Description
- **Dataset**: `daily_food_waste_clean.csv`
- **Rows**: 2190 (Train: 1752, Test: 438)
- **Limitation**: **100% Synthetic Data**. The data was programmatically generated via `1_generate_datasets.py`. As a result, performance metrics reflect the model's ability to reverse-engineer the generation logic, not real-world human behavior.

## 2. Prediction Target & Features
- **Target**: `food_wasted_kg` (Continuous variable, kg of wasted food)
- **Features Used**: people_served, temperature, rainfall, day_of_week, month, meal_type, festival, special_event
- **Leakage Check**: `food_prepared_kg` and `food_consumed_kg` were explicitly excluded to prevent target leakage, as they represent future/concurrent information.

## 3. Validation Methodology
- **Split Strategy**: Strictly chronological (last 20% held out as test set).
- **Cross-Validation**: `TimeSeriesSplit` used during hyperparameter tuning to prevent future data from leaking into past evaluations.

## 4. Hyperparameter Tuning
- **Method**: RandomizedSearchCV
- **Best Parameters**: {'regressor__subsample': 1.0, 'regressor__n_estimators': 50, 'regressor__max_depth': 3, 'regressor__learning_rate': 0.05}

## 5. Evaluation Metrics
| Metric | Naive Baseline (Median) | Final Model (XGBoost) |
|---|---|---|
| MAE | 6.39 | 6.25 |
| RMSE | 8.29 | 7.96 |
| R² | 0.31 | 0.36 |
| MAPE | 0.51 | 0.53 |

