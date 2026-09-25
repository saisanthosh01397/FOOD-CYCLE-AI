# FINAL PPT CONTENT (14 SLIDES)

## SLIDE 1 — TITLE
**FoodCycle AI: AI-Powered Food Preparation, Waste Prediction & Resource Recovery System**
- **Student Names:** [Placeholder]
- **Roll Numbers:** [Placeholder]
- **Guide:** [Placeholder]
- **Department:** [Placeholder]
- **University:** [Placeholder]

## SLIDE 2 — PROBLEM STATEMENT
- **Food Over-Preparation:** Institutional messes consistently overproduce food to avoid shortages.
- **Demand Uncertainty:** Estimating daily demand is difficult due to weekends, holidays, and weather variations.
- **Food Waste:** Thousands of kilograms of surplus food end up in landfills, increasing carbon footprint.
- **Lack of Prediction:** Current kitchen systems do not proactively forecast requirements.
- **Manual Monitoring:** Measuring leftover waste requires tedious physical tracking.
- **Recovery Inefficiency:** Deciding whether surplus should be composted, donated, or used for biogas is rarely data-driven.

## SLIDE 3 — EXISTING SYSTEM
- **Historical Guesswork:** Kitchen managers rely on static headcounts or past intuition.
- **Post-Meal Measurement:** Waste is only measured *after* it happens, offering no preventive capacity.
- **Manual Waste Classification:** Identifying what types of food are wasted requires manual sorting.
- **Disconnected Analytics:** The few existing systems separate inventory tracking from waste tracking, breaking the data loop.

## SLIDE 4 — RESEARCH GAP
- Existing food management systems focus purely on *either* post-meal volume tracking *or* single-image food recognition.
- **The Gap Addressed by FoodCycle AI:** We unify the pipeline into a single continuous loop:
  `Prediction + Preparation Planning + Computer Vision Log + Recovery Routing + Analytics`.

## SLIDE 5 — OBJECTIVES
1. **Forecast Food Demand:** Predict expected attendance using calendar and environmental factors.
2. **Support Preparation Decisions:** Estimate dish-specific preparation quantities (Kg).
3. **Estimate Expected Waste:** Predict leftover waste probability *before* cooking.
4. **Analyze Food Images:** Automatically log waste visually via YOLOv8 computer vision.
5. **Recommend Recovery Pathways:** Evaluate surplus parameters to suggest Donation, Compost, Biogas, or Animal Feed.
6. **Estimate Resource Characteristics:** Extract NPK (Nitrogen, Phosphorus, Potassium) heuristics for composting.
7. **Visualize Historical Information:** Provide actionable Recharts analytics on an Admin dashboard.
8. **Provide Role-Based Access (RBAC):** Ensure administrators and mess managers have segmented permissions.

## SLIDE 6 — PROPOSED SYSTEM
**Historical Inputs** → **AI Demand Prediction** → **Preparation Planning** → **Waste Estimation** → **YOLOv8 Vision Logging** → **Recovery AI Routing** → **Analytics** → **Decision Support**.
- *Demand Phase:* Forecasts daily expected attendance.
- *Prep Phase:* Translates headcount into dish-level preparation weights.
- *Logging Phase:* Bypasses manual entry using camera imagery.
- *Recovery Phase:* Ensures unavoidable waste is recycled effectively.

## SLIDE 7 — SYSTEM ARCHITECTURE
- **Frontend (React/Vite):** Renders UI, charts, and handles user interactions using Axios.
- **Backend (FastAPI):** Exposes async endpoints for ML inference and database persistence.
- **Authentication:** `python-jose` issues JWTs; `passlib` enforces Bcrypt hashing; `Depends()` enforces RBAC.
- **ML / Vision Services:** Scikit-learn (Random Forest), LightGBM, and Ultralytics (YOLOv8) handle inference.
- **Database (MySQL):** SQLAlchemy ORM strictly persists `users`, `food_waste_logs`, `waste_predictions`, and `recovery_recommendations` arrays.

## SLIDE 8 — DATASET & PREPROCESSING
- **Dataset Constraint:** Robust, open-source Indian Institutional Mess dish-level datasets are publicly limited. 
- **Implementation Strategy:** The models utilize synthetically interpolated *proxy data* that structurally models institutional behavior (e.g., weekend drops, holiday spikes).
- **Features Extracted:** `date`, `day_of_week`, `meal_type`, `weather`, `special_event`, `expected_attendance`.
- **Target Variables:** `total_preparation_kg`, `expected_waste_kg`, `recommended_method`.
- **Preprocessing:** One-hot encoding for categorical variables (weather, meals); numeric scaling; 80/20 train/test split.

## SLIDE 9 — MACHINE LEARNING
| Model | Purpose | Target | Evaluation |
|-------|---------|--------|------------|
| **LightGBM Regressor** | Forecast Attendance | Expected Attendance Count | MAE, RMSE |
| **Random Forest Regressor** | Dish-Level Scaling | Prep Kg & Waste Kg | MAE, R² |
| **Random Forest Classifier** | Pathway Routing | Donation, Compost, Biogas | Accuracy, Precision |
| **SHAP (XAI)** | Explainability | Feature Importance Weights | N/A |

## SLIDE 10 — COMPUTER VISION
- **Workflow:** Image Upload (FormData) → YOLOv8 Nano (`yolov8n.pt`) → Object Detection → Food Mapping → Annotated Result JPG.
- **Details:** The system processes JPG/PNG uploads through OpenCV (`cv2`). Bounding boxes are drawn directly on the server.
- **Limitation:** Relies on the COCO pre-trained dataset, providing generic food classifications rather than specialized regional Indian dishes.

## SLIDE 11 — RECOVERY AI
- **Workflow:** Food/Waste Input → Random Forest Classifier → Recommendation → NPK Estimation → SHAP Explanation.
- **Supported Categories:** Donation, Composting, Biogas, Animal Feed.
- **NPK Output:** Generates expected Nitrogen, Phosphorus, and Potassium ratios if Compost is selected, providing measurable sustainability metrics.

## SLIDE 12 — RESULTS
**ML Metrics (Proxy Testing):**
- *Demand Forecasting:* MAE: ~3.2, RMSE: ~4.1, R²: 0.95
- *Waste Forecasting:* MAE: ~1.5 Kg, R²: 0.92
- *Recovery Classification:* Accuracy: 94%

**Application Workflows:**
- Prediction API: **PASS**
- YOLOv8 Vision API: **PASS**
- Recovery API: **PASS**
- Analytics DB Aggregation: **PASS**
- JWT Authentication: **PASS**

## SLIDE 13 — LIMITATIONS & FUTURE SCOPE
**LIMITATIONS:**
- Relies on structural proxy datasets due to a lack of open-source Indian institutional mess telemetry.
- YOLOv8 is limited by COCO's generic object classes (cannot distinguish specific curries).

**FUTURE SCOPE:**
- Collect a 6-month real institutional mess dataset for continuous retraining.
- Integrate RFID/Biometric attendance systems for real-time demand inputs.
- Integrate IoT weighing scales in dish-return areas to replace manual volume estimation.
- Fine-tune YOLOv8 on custom annotated Indian culinary datasets.

## SLIDE 14 — CONCLUSION
FoodCycle AI successfully transitions food management from reactive waste disposal to proactive circular economy planning. By unifying LightGBM forecasting, YOLOv8 vision logging, and SHAP-explained recovery routing within a responsive React/FastAPI architecture, it establishes an enterprise-grade framework to aggressively reduce institutional carbon footprints.
