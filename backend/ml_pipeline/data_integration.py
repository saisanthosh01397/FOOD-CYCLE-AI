import pandas as pd
import numpy as np

class DataIntegrationLayer:
    """
    Acts as an adapter between generic public datasets (Genpact, HPI) 
    and specific institutional Indian dishes.
    """
    
    def __init__(self):
        # Configurable operational assumptions for menu mapping.
        # This allows real institutional historical data to be injected later.
        
        self.GENPACT_TO_DISH_MAPPING = {
            "Rice Bowl": {
                "Steamed Rice": 0.5,
                "Jeera Rice": 0.3,
                "Tomato Rice": 0.2
            },
            "Biryani": {
                "Chicken Biryani": 0.6,
                "Veg Biryani": 0.4
            },
            "Indian_Curry": {
                "Sambar": 0.3,
                "Vegetable Kurma": 0.25,
                "Chicken Curry": 0.25,
                "Paneer Curry": 0.2
            },
            "Soup": {
                "Rasam": 0.7,
                "Dal": 0.3
            },
            "Beverages": {
                "Curd": 0.6,
                "Buttermilk": 0.4
            }
        }
        
        # HPI Dataset Waste distribution references (mean, std) for waste percentage
        self.HPI_WASTE_DISTRIBUTIONS = {
            "Starches": {"mean": 0.12, "std": 0.04},   
            "Proteins": {"mean": 0.08, "std": 0.03},   
            "Vegetables": {"mean": 0.15, "std": 0.06}, 
            "Liquids": {"mean": 0.05, "std": 0.02}     
        }
        
        self.DISH_TO_MACRO_CATEGORY = {
            "Steamed Rice": "Starches",
            "Jeera Rice": "Starches",
            "Tomato Rice": "Starches",
            "Chicken Biryani": "Proteins",
            "Veg Biryani": "Starches",
            "Sambar": "Liquids",
            "Vegetable Kurma": "Vegetables",
            "Chicken Curry": "Proteins",
            "Paneer Curry": "Proteins",
            "Rasam": "Liquids",
            "Dal": "Liquids",
            "Curd": "Liquids",
            "Buttermilk": "Liquids"
        }
        
        # Operational conversion factors (kg per serving)
        self.SERVING_CONVERSIONS_KG = {
            "Steamed Rice": 0.15,
            "Jeera Rice": 0.15,
            "Tomato Rice": 0.15,
            "Chicken Biryani": 0.25,
            "Veg Biryani": 0.20,
            "Sambar": 0.20,
            "Vegetable Kurma": 0.15,
            "Chicken Curry": 0.20,
            "Paneer Curry": 0.18,
            "Rasam": 0.15,
            "Dal": 0.15,
            "Curd": 0.10,
            "Buttermilk": 0.15
        }

    def map_genpact_demand(self, category: str, total_predicted_demand: float) -> dict:
        mapping = self.GENPACT_TO_DISH_MAPPING.get(category, {})
        if not mapping:
            return {}
            
        dish_demands = {}
        for dish, proportion in mapping.items():
            dish_demands[dish] = max(0.0, total_predicted_demand * proportion)
        return dish_demands

    def get_waste_distribution(self, dish_name: str) -> dict:
        macro = self.DISH_TO_MACRO_CATEGORY.get(dish_name, "Vegetables")
        return self.HPI_WASTE_DISTRIBUTIONS.get(macro)
        
    def get_serving_weight(self, dish_name: str) -> float:
        return self.SERVING_CONVERSIONS_KG.get(dish_name, 0.15)
