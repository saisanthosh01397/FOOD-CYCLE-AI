import os
import logging
from datetime import date, timedelta
import sys

# Add backend directory to path if needed to ensure absolute imports work
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from ml_pipeline.models.prediction_pipeline import PredictionPipeline

logger = logging.getLogger(__name__)

class PredictionService:
    def __init__(self):
        self.pipeline = None
        self.load_model()

    def load_model(self):
        try:
            self.pipeline = PredictionPipeline()
            logger.info("Dish-level ML Pipeline loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load Dish-level ML Pipeline: {e}")

    def predict(self, log_data: dict) -> dict:
        if self.pipeline is None:
            return {"error": "Dish-level ML Pipeline not trained/loaded yet."}
            
        try:
            target_date_str = log_data.get('date')
            if not target_date_str:
                target_date_str = (date.today() + timedelta(days=1)).isoformat()
                
            meal_type = log_data.get('meal_type', 'Lunch').capitalize()
            if meal_type.lower() == 'all_day':
                meal_type = 'Lunch'
                
            people = int(log_data.get('people', 150))
            menu_items = log_data.get('menu_items', None)
            
            # Predict dish level forecast
            result = self.pipeline.predict_dish_level_forecast(
                date_str=target_date_str, 
                expected_attendance=people, 
                meal_type=meal_type,
                menu_items=menu_items
            )
            
            return result
        except Exception as e:
            logger.error(f"Prediction failed: {e}")
            return {"error": str(e)}

prediction_service = PredictionService()
