import os
import logging
import threading
from datetime import date, timedelta
import sys

logger = logging.getLogger(__name__)

class PredictionService:
    def __init__(self):
        self.pipeline = None
        self._lock = threading.Lock()
        self._loaded = False

    def _ensure_loaded(self):
        """Lazy-load the prediction pipeline on first use."""
        if self._loaded:
            return
        with self._lock:
            if self._loaded:
                return
            try:
                # Add backend directory to path for absolute imports
                backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
                if backend_dir not in sys.path:
                    sys.path.insert(0, backend_dir)
                from ml_pipeline.models.prediction_pipeline import PredictionPipeline
                self.pipeline = PredictionPipeline()
                logger.info("Dish-level ML Pipeline loaded successfully.")
            except Exception as e:
                logger.error(f"Failed to load Dish-level ML Pipeline: {e}")
                self.pipeline = None
            self._loaded = True

    def predict(self, log_data: dict) -> dict:
        self._ensure_loaded()
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

# Singleton — instantiated here but models NOT loaded until first predict() call
prediction_service = PredictionService()
