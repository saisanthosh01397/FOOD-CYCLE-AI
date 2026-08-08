import os
import joblib
import pandas as pd
import numpy as np
import logging

try:
    import shap
except ImportError:
    shap = None

logger = logging.getLogger(__name__)

class RecoveryService:
    def __init__(self):
        self.recovery_model = None
        self.npk_model = None
        self.label_encoder = None
        self.scaler = None
        self.target_encoder = None
        self.features = ['food_category_encoded', 'weight', 'moisture', 'freshness', 'contamination_level', 'organic_percentage']
        self.load_models()

    def load_models(self):
        models_dir = os.path.join(os.path.dirname(__file__), '../../models/saved_models')
        try:
            if os.path.exists(os.path.join(models_dir, 'recovery_model_v1.pkl')):
                self.recovery_model = joblib.load(os.path.join(models_dir, 'recovery_model_v1.pkl'))
                self.npk_model = joblib.load(os.path.join(models_dir, 'npk_model_v1.pkl'))
                self.label_encoder = joblib.load(os.path.join(models_dir, 'label_encoder_v1.pkl'))
                self.scaler = joblib.load(os.path.join(models_dir, 'scaler_v1.pkl'))
                self.target_encoder = joblib.load(os.path.join(models_dir, 'target_encoder_v1.pkl'))
                logger.info("Recovery and NPK models loaded successfully.")
            else:
                logger.warning("Recovery models not found.")
        except Exception as e:
            logger.error(f"Failed to load Recovery models: {e}")

    def recommend(self, log_data: dict) -> dict:
        if self.recovery_model is None:
            return {"error": "Model not trained yet."}
            
        try:
            # Extract features from log_data (with defaults if missing)
            cat = log_data.get('food_category', 'Mixed')
            weight = log_data.get('quantity_kg', 10.0)
            moisture = log_data.get('moisture', 60.0)
            freshness = log_data.get('freshness', 50.0)
            contamination = log_data.get('contamination_level', 10.0)
            organic = log_data.get('organic_percentage', 90.0)
            
            print(f"[DEBUG] Processing category: {cat}, weight: {weight}")
            # Encode category
            try:
                cat_encoded = self.label_encoder.transform([cat])[0]
            except ValueError:
                cat_encoded = 0 # Default to first class if unseen
            
            print(f"[DEBUG] Category encoded: {cat_encoded}")
                
            # Create feature array
            raw_features = pd.DataFrame([{
                'food_category_encoded': cat_encoded,
                'weight': weight,
                'moisture': moisture,
                'freshness': freshness,
                'contamination_level': contamination,
                'organic_percentage': organic
            }])
            
            # Scale numeric features
            num_cols = ['weight', 'moisture', 'freshness', 'contamination_level', 'organic_percentage']
            scaled_num = self.scaler.transform(raw_features[num_cols])
            
            X = np.zeros((1, len(self.features)))
            X[0, 0] = cat_encoded
            X[0, 1:] = scaled_num[0]
            
            X_df = pd.DataFrame(X, columns=self.features)
            
            # Predict method
            if hasattr(self.recovery_model, "predict_proba"):
                probs = self.recovery_model.predict_proba(X_df)[0]
                pred_idx = np.argmax(probs)
                confidence = float(probs[pred_idx])
            else:
                pred_idx = int(self.recovery_model.predict(X_df)[0])
                confidence = 0.85 # Mock confidence if no predict_proba (unlikely for RF/XGB)
                
            pred_method = self.target_encoder.inverse_transform([pred_idx])[0]
            
            # Predict NPK
            npk = self.npk_model.predict(X_df)[0]
            nitrogen = max(0.0, float(npk[0]))
            phosphorus = max(0.0, float(npk[1]))
            potassium = max(0.0, float(npk[2]))
            
            print(f"[DEBUG] SHAP/XAI starting for {pred_method}")
            # Explainable AI (XAI)
            try:
                explanation, top_features = self.generate_explanation(X_df, pred_method, raw_features.iloc[0], cat)
            except Exception as ex:
                print(f"[DEBUG] SHAP exception: {ex}")
                explanation, top_features = "Fallback explanation", []
            print(f"[DEBUG] SHAP/XAI finished")
            
            print(f"[DEBUG] Recommendation complete: {pred_method}")
            
            return {
                "recommended_method": pred_method,
                "confidence_score": round(confidence, 2),
                "npk_estimation": {
                    "nitrogen": round(nitrogen, 2),
                    "phosphorus": round(phosphorus, 2),
                    "potassium": round(potassium, 2)
                },
                "xai": {
                    "top_contributing_features": top_features,
                    "human_readable_explanation": explanation
                }
            }
        except Exception as e:
            print(f"[DEBUG] Exception in recommend: {e}")
            logger.error(f"Recommendation failed: {e}")
            return {"error": str(e)}
            
    def generate_explanation(self, X_df, method, raw_vals, original_category_name="Mixed"):
        top_features = []
        try:
            if shap is not None:
                # Use SHAP TreeExplainer
                explainer = shap.TreeExplainer(self.recovery_model)
                shap_values = explainer.shap_values(X_df)
                
                # Check SHAP format based on model type (list for multi-class RF, array for XGB)
                if isinstance(shap_values, list):
                    # Get class index
                    class_idx = list(self.target_encoder.classes_).index(method)
                    vals = np.abs(shap_values[class_idx][0])
                else:
                    if len(shap_values.shape) == 3:
                        class_idx = list(self.target_encoder.classes_).index(method)
                        vals = np.abs(shap_values[0, :, class_idx])
                    else:
                        vals = np.abs(shap_values[0])
                
                feature_importance = pd.DataFrame(list(zip(self.features, vals)), columns=['feature','importance'])
                feature_importance.sort_values(by='importance', ascending=False, inplace=True)
                top_features = feature_importance['feature'].head(3).tolist()
            else:
                # Fallback to feature importance
                importances = self.recovery_model.feature_importances_
                feature_importance = pd.DataFrame(list(zip(self.features, importances)), columns=['feature','importance'])
                feature_importance.sort_values(by='importance', ascending=False, inplace=True)
                top_features = feature_importance['feature'].head(3).tolist()
        except Exception as e:
            logger.warning(f"SHAP explanation failed, using fallback: {e}")
            top_features = ['organic_percentage', 'moisture', 'contamination_level']
            
        # Generate human-readable string
        reasons = []
        for f in top_features:
            val = raw_vals.get(f.replace('_encoded', ''), None)
            if 'contamination' in f:
                desc = "low" if val < 10 else "high"
                reasons.append(f"{desc} contamination ({val:.1f}%)")
            elif 'moisture' in f:
                desc = "high" if val > 60 else "low"
                reasons.append(f"{desc} moisture ({val:.1f}%)")
            elif 'freshness' in f:
                desc = "high" if val > 70 else "low"
                reasons.append(f"{desc} freshness")
            elif 'organic' in f:
                desc = "high" if val > 80 else "low"
                reasons.append(f"{desc} organic content")
            elif 'category' in f:
                reasons.append(f"food category being {original_category_name}")
        
        explanation = f"{method} is recommended because the waste has " + ", ".join(reasons) + "."
        return explanation, top_features

    def get_history(self):
        return []

recovery_service = RecoveryService()
