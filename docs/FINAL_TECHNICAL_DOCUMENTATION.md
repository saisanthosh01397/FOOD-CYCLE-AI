# FINAL TECHNICAL DOCUMENTATION
## FoodCycle AI: Enterprise Food Waste Management & Circular Economy System

### 1. PROJECT OVERVIEW
**Problem:** Institutional food services (hostels, messes, cafeterias) suffer from significant food waste due to inaccurate demand forecasting, fixed menus, and lack of systematic surplus tracking. 
**Solution:** FoodCycle AI is an enterprise platform combining XGBoost regression, Random Forest, and YOLOv8 computer vision to optimize preparation quantities, forecast dish-level waste, and route surplus food to sustainable recovery paths (Compost, Biogas, Donation).
**Main Users:** 
- **Mess Managers:** Oversee daily operations, input expected attendance, and log actual waste.
- **Administrators:** Oversee user access, system health, and high-level enterprise metrics.
**Main Workflow:** Expected Attendance → Menu/Dish Prediction → Prep & Waste Forecast → Actionable Prevention → Visual Logging (YOLO) → Recovery Pathway Recommendation → Analytics & Reporting.
**Expected Impact:** Minimizes overproduction, significantly reduces carbon footprint, and transforms unavoidable waste into economic/environmental value.

### 2. OBJECTIVES
- **Food Demand Forecasting:** Predict expected attendance using calendar and environmental factors.
- **Preparation Quantity Prediction:** Map attendance to specific dish-level preparation weights (Kg).
- **Food Waste Prediction:** Forecast expected leftover weight.
- **Prevention Recommendations:** Generate AI-driven mitigation steps (e.g., batch cooking, portion control).
- **Computer Vision Food Recognition:** Automatically classify and measure volume using YOLO object detection.
- **Recovery Recommendation:** Employ Random Forest + SHAP to determine if waste should go to Animal Feed, Biogas, Compost, or Donation.
- **NPK/Resource Analysis:** Estimate Nitrogen, Phosphorus, Potassium value for composting pathways.
- **Analytics & Historical Tracking:** Aggregate all operational data into a distributed ledger and dashboard.

### 3. SYSTEM ARCHITECTURE
- **Frontend:** React + Vite, Tailwind CSS, Recharts, Framer Motion.
- **Backend:** FastAPI (Python).
- **Database:** MySQL + SQLAlchemy ORM.
- **Authentication:** JWT (JSON Web Tokens) with Role-Based Access Control (RBAC).
- **ML Layer:** Scikit-learn (Random Forest), LightGBM (Demand), Ultralytics (YOLOv8), SHAP (Explainability).
- **Computer Vision:** OpenCV for image processing, YOLOv8 for bounding box regression.
- **Recovery System:** Rules + ML pipeline to estimate nutritional and compost metrics.
- **Analytics:** Server-side aggregation queries exposed to Recharts data structures.

**Data Flow:**
User → React (Axios) → FastAPI → ML/AI inference (Pickle/PT) → MySQL Persistence → JSON Response → Visualization (Framer Motion/Recharts).

### 4. TECHNOLOGY STACK
| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React (Vite) | UI Framework |
| Styling | Tailwind CSS | Rapid UI styling & Dark Mode |
| Charts | Recharts | Analytics visualization |
| Backend | FastAPI | High-performance asynchronous API |
| Database | MySQL | Relational data persistence |
| ORM | SQLAlchemy | Database abstraction & schema mapping |
| Auth | python-jose, passlib | JWT generation and Bcrypt hashing |
| ML Core | Scikit-learn, LightGBM | Forecasting and classification models |
| Vision | Ultralytics (YOLOv8), OpenCV | Object detection and image processing |
| Explainability | SHAP | ML Interpretability for Recovery recommendations |

### 5. MACHINE LEARNING SUMMARY (See ML_MODEL_REPORT.md for details)
- **Demand Model:** LightGBM Regressor
- **Waste/Preparation Model:** Random Forest Regressor
- **Recovery Model:** Random Forest Classifier + SHAP
- **Data Reality:** The underlying training data incorporates synthetic permutations to map structural relationships, as highly specific Indian Hostel mess dish-level datasets were severely limited publicly. These serve as proxy representations for system logic validation.

### 6. COMPUTER VISION
- **YOLO Model:** Uses the `yolov8n.pt` (nano) pretrained weights.
- **Image Processing:** OpenCV (`cv2`) handles parsing multipart `FormData` byte streams.
- **Output:** Returns bounding boxes, confidence intervals, and string class names mapped from the COCO dataset.
- **Storage:** Persists raw images to `/uploads/images` and annotated images (with drawn boxes) to `/uploads/results`.
- **API integration:** Returns JSON mapping seamlessly to the Food Ledger database `ImageMetadata` schema.

### 7. RECOVERY AI
- **Input:** Waste Category (String), Quantity (Kg, Float), Moisture, Contamination.
- **Model:** Random Forest Classifier.
- **Prediction:** Output classes = [Donation, Compost, Biogas, Animal Feed].
- **NPK Calculation:** Heuristic mapping based on chemical composition proxies (e.g., Vegetables yield higher Nitrogen/Potassium ratios).
- **Explanation:** SHAP calculates exact feature importance contributions mapped to the selected pathway.

### 8. DATABASE
- **`users`**: Stores authentication credentials (Bcrypt), RBAC roles, and statuses.
- **`food_waste_logs`**: The core operational ledger. Parent table containing Date, Meal Type, Category, and Weight.
- **`waste_predictions`**: Child table storing JSON arrays of dish-level expected preparation, consumption, and prevention actions.
- **`image_metadata`**: Child table pointing to saved YOLO image artifacts.
- **`recovery_recommendations`**: Child table storing NPK metrics and optimal recovery paths.

### 9. API (See API_DOCUMENTATION.md for details)
Exposes `/auth`, `/users`, `/prediction`, `/vision`, `/recovery`, `/dashboard`, and `/history` REST endpoints.

### 10. SECURITY
- **JWT:** Ephemeral token-based auth stored client-side.
- **Password Hashing:** `passlib` with Bcrypt.
- **RBAC:** FastAPI `Depends(get_current_admin_user)` actively restricts `/users` modifications to Administrators.
- **Upload Restrictions:** Size and Mime-type validations (10MB limit, image/jpeg, image/png).

### 11. TESTING (See TEST_REPORT.md for details)
Validated heavily against API integrity, Database relational integrity, and React rendering constraints.

### 12. LIMITATIONS
- **Data Availability:** Precise Indian institutional dish-level waste logs are scarce. The models rely partially on synthetic interpolation (proxy data) to establish functional pathways rather than real-world measured hostel logs.
- **YOLO Classes:** `yolov8n.pt` is trained on COCO (common objects). While it detects generic "food" (apples, bowls, pizzas), it lacks specialized classes for specific regional Indian cuisine (e.g., identifying Dosa vs. Idli).
- **Hardware Limitations:** Vision inference runs on CPU locally unless configured explicitly for CUDA.

### 13. FUTURE SCOPE
- Collect genuine Indian institutional mess data over a 6-month period for authentic retraining.
- Integrate active student/employee attendance IoT systems (RFID tap-ins) for real-time demand pipelines.
- Implement mobile-friendly capturing for dish-return areas.
- Fine-tune YOLOv8 on a custom annotated dataset of regional cuisine.

### 14. FINAL PROJECT SUMMARY
FoodCycle AI proves that bridging modern machine learning (Forecasting, Classification, XAI) and computer vision within a responsive full-stack architecture can structurally mitigate food waste. By actively estimating preparation quantities and intelligently routing surplus to bio-recovery or donation, the system transitions institutional kitchens from reactive waste disposal to proactive circular economy management.
