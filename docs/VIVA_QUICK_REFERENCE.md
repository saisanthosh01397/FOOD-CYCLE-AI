# VIVA QUICK REFERENCE (FACT SHEET)

Memorize these exact, implemented facts for the project presentation and viva.

- **Project Objective:** To minimize institutional food waste by optimizing preparation quantities and intelligently routing unavoidable surplus to sustainable recovery pathways.
- **Problem Statement:** Messes overproduce food due to rigid menus and blind forecasting, lacking visual tracking and sustainable disposal mechanisms.
- **Research Gap:** Existing solutions either only track weight *or* only recognize food. FoodCycle AI bridges dish-level prediction, computer vision tracking, and XAI-based sustainable routing into a single enterprise architecture.
- **Frontend Technology:** React, Vite, Tailwind CSS, Framer Motion, Recharts.
- **Backend Technology:** FastAPI (Python), Uvicorn, Pydantic.
- **Database:** MySQL relational database managed via SQLAlchemy ORM.
- **Authentication & RBAC:** `python-jose` for JWT tokens, `passlib` (Bcrypt) for password hashing. Endpoints protected via FastAPI `Depends()` middleware.
- **ML Models (Forecasting):** LightGBM Regressor (Demand) + Random Forest Regressor (Waste/Preparation mapping).
- **ML Models (Recovery):** Random Forest Classifier + SHAP (SHapley Additive exPlanations).
- **Computer Vision:** YOLOv8 Nano (`yolov8n.pt`) deployed via Ultralytics and OpenCV. Detects bounding boxes and extracts COCO-based confidence labels.
- **Datasets:** Models utilize synthetic/proxy interpolation modeling institutional behavior.
- **Features (Prediction):** Date, Day of Week, Weather, Meal Type, Expected Attendance, Special Event.
- **Targets (Prediction):** Dish-level Preparation Kg, Consumption Kg, Total Waste Kg, Preventive Actions.
- **Features (Recovery):** Category, Quantity, Moisture, Contamination, Organic Percentage.
- **Targets (Recovery):** Output Pathway (Compost, Biogas, Donation, Animal Feed) + NPK calculations.
- **Validation:** 80/20 Train/Test split.
- **Limitations:** Accurate dish-level institutional data for Indian messes is not publicly available, meaning the models utilize proxy arrays. YOLOv8 utilizes generic COCO classes (e.g., "bowl", "pizza") rather than localized Indian cuisine.
- **Future Scope:** Implement real-world IoT scale integrations, retrain the YOLOv8 model on custom Indian dish datasets, and collect 6-month institutional telemetry for true demand forecasting.
