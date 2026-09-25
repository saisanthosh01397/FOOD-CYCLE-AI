# MACHINE LEARNING MODEL REPORT

## 1. Demand & Preparation Forecasting

**Model:** LightGBM Regressor (Demand) & Random Forest Regressor (Dish-level mapping)
**Purpose:** Predict the total number of expected attendees and accurately map that demand into specific dish preparation weights (Kg) to prevent overproduction.
**Dataset Constraints:** Due to the absence of robust open-source Indian Institutional Mess datasets, the baseline uses synthetic/proxy relationships modeling typical hostel behavior (e.g., lower attendance on weekends, higher demand for special dishes).
**Features:** 
- `date`, `day_of_week`, `meal_type`
- `weather` (sunny, rainy, cloudy)
- `special_event` (holiday, festival, standard)
- `expected_attendance`
**Target:** 
- `total_preparation_kg`
- `expected_consumption_kg`
- `total_expected_waste_kg`
**Preprocessing:** One-hot encoding for categorical variables (weather, meal phase). Scaling numerical constraints.
**Training & Validation:** Train/Test split (80/20) simulating a 1-year academic calendar. 
**Saved Artifacts:** `demand_forecast_model.pkl`, `food_waste_model.pkl`, `label_encoders.pkl`
**Inference Endpoint:** `POST /prediction`

---

## 2. Recovery & Sustainability Recommendation

**Model:** Random Forest Classifier + SHAP (Explainable AI)
**Purpose:** Evaluate unavoided surplus/waste and determine the most environmentally and economically viable recovery pathway.
**Features:** 
- `food_category` (Vegetables, Grains, Meat, Dairy, Mixed)
- `quantity_kg` (Float)
- `moisture`, `freshness`, `contamination_level`, `organic_percentage` (Floats)
**Target:** 
- `recommended_method` (Donation, Animal Feed, Composting, Biogas)
**NPK Heuristics:** If the model routes to "Compost", a post-processing heuristic extracts expected Nitrogen, Phosphorus, and Potassium yields based on category proxy ratios.
**XAI Integration:** SHAP (SHapley Additive exPlanations) is applied to the Random Forest predictions to explain *why* a specific pathway was chosen (e.g., High contamination negated Donation, pushing the result to Biogas).
**Saved Artifact:** `recovery_model.pkl`
**Inference Endpoint:** `POST /recovery`

---

## 3. Computer Vision (Waste Detection)

**Model:** YOLOv8 Nano (`yolov8n.pt`) via Ultralytics
**Purpose:** Scan physical trays or bins to identify food components without manual data entry, providing volume proxies and visual evidence of waste.
**Dataset:** Pre-trained on the COCO (Common Objects in Context) dataset.
**Limitations:** Because it relies on COCO, it identifies generic macro-classes ("apple", "bowl", "pizza", "sandwich") rather than specific Indian cuisine ("roti", "dal").
**Preprocessing:** OpenCV resizes the incoming `FormData` image and normalizes it for the YOLO network.
**Output:** Generates bounding boxes, extracts confidence metrics, and renders an annotated `.jpg` artifact saved to the server.
**Inference Endpoint:** `POST /vision/analyze-image`

---

## 4. Summary of Data Reality

FoodCycle AI is architecturally sound and functionally robust. However, for true production deployment in a specific institution, the ML layer requires **Fine-Tuning**:
1. **Vision:** A custom YOLOv8 model must be trained on a proprietary annotated dataset of the institution's specific menu items.
2. **Regression:** The forecasting models must be retrained using 3–6 months of actual localized mess ledger data to transition from functional proxy logic to high-accuracy operational predictions.
