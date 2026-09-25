# RELEASE INFO

**Project:**  
FoodCycle AI

**Frontend:**  
React + Vite (Tailwind CSS, Framer Motion, Recharts)

**Backend:**  
FastAPI (Python, Uvicorn, Pydantic)

**Database:**  
MySQL (SQLAlchemy ORM)

**ML:**  
- `demand_forecast_model.pkl` (LightGBM)
- `food_waste_model.pkl` (Random Forest Regressor)
- `recovery_model.pkl` (Random Forest Classifier + SHAP)

**Computer Vision:**  
Ultralytics YOLOv8 (`yolov8n.pt`) with OpenCV processing bounding boxes from `multipart/form-data` uploads.

**Authentication:**  
JSON Web Tokens (JWT) using `python-jose` and Bcrypt password hashing (`passlib`).

**Roles:**  
- `administrator` (Full platform access)
- `mess_manager` (Restricted operational access)

**Development date:**  
2026-09-25
