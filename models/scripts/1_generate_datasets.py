import pandas as pd
import numpy as np
from datetime import timedelta, date
import json
import os
import time

# Set fixed seed for reproducibility
SEED = 42
np.random.seed(SEED)

RAW_DIR = "../../datasets/raw"
META_DIR = "../../datasets/metadata"
os.makedirs(RAW_DIR, exist_ok=True)
os.makedirs(META_DIR, exist_ok=True)

def generate_daily_food_waste():
    print("Generating Daily Food Waste Dataset...")
    num_days = 730
    start_date = date.today() - timedelta(days=num_days)
    
    dates = [start_date + timedelta(days=i) for i in range(num_days)]
    
    data = []
    for d in dates:
        for meal in ['Breakfast', 'Lunch', 'Dinner']:
            day_of_week = d.weekday() # 0-6 (Mon-Sun)
            month = d.month
            
            # Base attendance
            base_people = 300 if meal == 'Lunch' else (200 if meal == 'Dinner' else 150)
            
            # Weekend effect (less people)
            if day_of_week >= 5:
                base_people = int(base_people * 0.6)
                
            # Weather effects
            temp = np.random.normal(loc=25, scale=5)
            rainfall = np.random.exponential(scale=2) if np.random.rand() > 0.8 else 0.0
            
            if rainfall > 5:
                base_people = int(base_people * 0.8)
                
            # Festivals / Special Events
            festival = 1 if np.random.rand() > 0.98 else 0
            special_event = 1 if np.random.rand() > 0.95 else 0
            
            if festival:
                base_people = int(base_people * 1.5)
            elif special_event:
                base_people = int(base_people * 1.3)
                
            people_served = max(50, int(np.random.normal(loc=base_people, scale=base_people*0.1)))
            
            # Food calculations (approx 0.5kg prepared per person)
            food_prepared = people_served * np.random.uniform(0.4, 0.6)
            
            # Consumption logic
            consumption_rate = np.random.uniform(0.7, 0.95)
            if festival:
                consumption_rate = np.random.uniform(0.85, 0.98) # Less waste proportionally, but higher volume
                
            food_consumed = food_prepared * consumption_rate
            food_wasted = food_prepared - food_consumed
            
            data.append({
                'date': d,
                'day_of_week': day_of_week,
                'month': month,
                'meal_type': meal,
                'people_served': people_served,
                'food_prepared_kg': round(food_prepared, 2),
                'food_consumed_kg': round(food_consumed, 2),
                'food_wasted_kg': round(food_wasted, 2),
                'temperature': round(temp, 1),
                'rainfall': round(rainfall, 1),
                'festival': festival,
                'special_event': special_event
            })
            
    df = pd.DataFrame(data)
    filepath = os.path.join(RAW_DIR, "daily_food_waste.csv")
    df.to_csv(filepath, index=False)
    return len(df), filepath

def generate_recovery_data():
    print("Generating Recovery Dataset...")
    num_samples = 5500
    
    categories = ['Vegetables', 'Grains', 'Meat', 'Fruits', 'Mixed']
    
    data = []
    for _ in range(num_samples):
        cat = np.random.choice(categories, p=[0.4, 0.3, 0.1, 0.1, 0.1])
        weight = np.random.uniform(1.0, 50.0)
        
        # Properties based on category
        if cat == 'Vegetables':
            moisture = np.random.uniform(70, 95)
            organic_pct = np.random.uniform(90, 100)
            n, p, k = np.random.normal(1.5, 0.2), np.random.normal(0.5, 0.1), np.random.normal(1.2, 0.2)
        elif cat == 'Meat':
            moisture = np.random.uniform(50, 75)
            organic_pct = np.random.uniform(85, 95)
            n, p, k = np.random.normal(3.0, 0.5), np.random.normal(1.0, 0.2), np.random.normal(0.5, 0.1)
        elif cat == 'Grains':
            moisture = np.random.uniform(10, 30)
            organic_pct = np.random.uniform(95, 100)
            n, p, k = np.random.normal(1.0, 0.1), np.random.normal(0.3, 0.05), np.random.normal(0.4, 0.05)
        else:
            moisture = np.random.uniform(40, 85)
            organic_pct = np.random.uniform(80, 98)
            n, p, k = np.random.normal(1.2, 0.3), np.random.normal(0.4, 0.1), np.random.normal(0.8, 0.2)
            
        freshness = np.random.uniform(0, 100) # 0 = spoiled, 100 = fresh
        contamination = np.random.uniform(0, 30) # % of non-organic or bad contamination
        
        # Rule based ground truth for 'recommended_method'
        if freshness > 80 and contamination < 5 and cat != 'Mixed':
            method = 'Donation'
        elif contamination < 10 and cat != 'Meat':
            method = 'Animal Feed'
        elif moisture > 60 and organic_pct > 85:
            method = 'Biogas'
        else:
            method = 'Compost'
            
        # Yield calculations
        compost_yield = weight * 0.4 * (organic_pct / 100)
        biogas_yield = weight * 0.2 * (moisture / 100)
        animal_feed_score = freshness - contamination
        donation_score = freshness * 1.2 - contamination * 2
        
        data.append({
            'food_category': cat,
            'weight': round(weight, 2),
            'moisture': round(moisture, 2),
            'freshness': round(freshness, 2),
            'contamination_level': round(contamination, 2),
            'organic_percentage': round(organic_pct, 2),
            'recommended_method': method,
            'compost_yield': round(compost_yield, 2),
            'biogas_yield': round(biogas_yield, 2),
            'animal_feed_score': round(animal_feed_score, 2),
            'donation_score': round(donation_score, 2),
            'nitrogen': round(n, 2),
            'phosphorus': round(p, 2),
            'potassium': round(k, 2)
        })
        
    df = pd.DataFrame(data)
    filepath = os.path.join(RAW_DIR, "recovery_data.csv")
    df.to_csv(filepath, index=False)
    return len(df), filepath

def generate_sustainability_data():
    print("Generating Sustainability Dataset...")
    num_samples = 365
    
    data = []
    for _ in range(num_samples):
        diverted = np.random.uniform(50, 500)
        compost = diverted * np.random.uniform(0.3, 0.5)
        biogas = diverted * np.random.uniform(0.1, 0.3)
        co2 = diverted * 1.9 # Approx 1.9kg CO2e per kg food waste
        water = diverted * np.random.uniform(10, 50)
        landfill = diverted * 0.9
        sdg = np.random.uniform(60, 95)
        
        data.append({
            'waste_diverted': round(diverted, 2),
            'compost_generated': round(compost, 2),
            'biogas_generated': round(biogas, 2),
            'co2_saved': round(co2, 2),
            'water_saved': round(water, 2),
            'landfill_reduction': round(landfill, 2),
            'sdg_score': round(sdg, 2)
        })
        
    df = pd.DataFrame(data)
    filepath = os.path.join(RAW_DIR, "sustainability_data.csv")
    df.to_csv(filepath, index=False)
    return len(df), filepath

if __name__ == "__main__":
    t0 = time.time()
    n_daily, p_daily = generate_daily_food_waste()
    n_recov, p_recov = generate_recovery_data()
    n_sust, p_sust = generate_sustainability_data()
    
    metadata = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "random_seed": SEED,
        "datasets": {
            "daily_food_waste": {"rows": n_daily, "path": p_daily},
            "recovery_data": {"rows": n_recov, "path": p_recov},
            "sustainability": {"rows": n_sust, "path": p_sust}
        },
        "generation_time_seconds": round(time.time() - t0, 2)
    }
    
    with open(os.path.join(META_DIR, "generation_metadata.json"), "w") as f:
        json.dump(metadata, f, indent=4)
        
    print(f"Dataset generation complete. Metadata saved to {META_DIR}/generation_metadata.json")
