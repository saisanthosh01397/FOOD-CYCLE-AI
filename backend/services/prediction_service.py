import os
import joblib
import pandas as pd
from datetime import date, timedelta
import logging

logger = logging.getLogger(__name__)

class PredictionService:
    def __init__(self):
        self.model = None
        self.load_model()

    def load_model(self):
        try:
            model_path = os.path.join(os.path.dirname(__file__), '../../models/saved_models/prophet_model_v1.pkl')
            if os.path.exists(model_path):
                self.model = joblib.load(model_path)
                logger.info("Prophet forecasting model loaded successfully.")
            else:
                logger.warning(f"Model file not found at {model_path}")
        except Exception as e:
            logger.error(f"Failed to load Prophet model: {e}")

    def predict(self, log_data: dict) -> dict:
        if self.model is None:
            return {"error": "Model not trained yet."}
            
        try:
            # Predict for tomorrow
            tomorrow = date.today() + timedelta(days=1)
            future = pd.DataFrame({'ds': [tomorrow]})
            forecast = self.model.predict(future)
            
            predicted_wasted_kg = float(forecast['yhat'].iloc[0])
            # Prophet doesn't natively give a confidence percentage between 0 and 1, 
            # but we can simulate a confidence score based on uncertainty intervals
            yhat_lower = float(forecast['yhat_lower'].iloc[0])
            yhat_upper = float(forecast['yhat_upper'].iloc[0])
            interval = yhat_upper - yhat_lower
            confidence = max(0.0, min(1.0, 1.0 - (interval / (predicted_wasted_kg + 1e-5))))
            
            return {
                "prediction_date": tomorrow.isoformat(),
                "predicted_quantity": round(predicted_wasted_kg, 2),
                "confidence_score": round(confidence, 2)
            }
        except Exception as e:
            logger.error(f"Prediction failed: {e}")
            return {"error": str(e)}

prediction_service = PredictionService()
