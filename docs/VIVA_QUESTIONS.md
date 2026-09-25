# VIVA PREPARATION QUESTIONS & ANSWERS

## 1. Project Basics & Problem Statement
**Q1: What is the primary objective of FoodCycle AI?**
A: To minimize institutional food waste by proactively predicting preparation quantities and intelligently routing unavoidable surplus to sustainable recovery pathways (like composting or donation).

**Q2: Why is estimating demand so difficult in institutional messes?**
A: Demand fluctuates heavily based on weekends, holidays, special events, and even weather, making static historical guesswork highly inaccurate.

**Q3: What specific research gap does your system address?**
A: Existing systems usually focus on either tracking waste *after* a meal or performing isolated image detection. FoodCycle AI unifies predictive prep planning, computer vision logging, and sustainable recovery routing into one continuous loop.

## 2. Dataset & Features
**Q4: What data did you use to train your models?**
A: Due to the lack of open-source Indian institutional mess datasets, we modeled synthetic/proxy datasets that structurally mimic institutional behaviors (e.g., weekend attendance drops) to validate the system's logic.

**Q5: What are the main features used in the Prediction model?**
A: Date, Day of the Week, Meal Phase (Breakfast/Lunch/Dinner), Weather, Special Events, and Expected Base Attendance.

## 3. Machine Learning & Model Selection
**Q6: Why did you choose LightGBM for demand forecasting?**
A: LightGBM handles categorical variables natively and operates efficiently on tabular data with non-linear relationships, making it ideal for temporal attendance forecasting.

**Q7: Why use Random Forest for the Dish-level preparation mapping?**
A: Random Forest Regressors are robust to overfitting and handle the multi-output variance of different food categories (Grains, Vegetables, Meat) exceptionally well.

**Q8: What evaluation metrics did you use for the regression models?**
A: We used Mean Absolute Error (MAE), Root Mean Squared Error (RMSE), and R-squared (R²).

**Q9: What is the purpose of the Recovery AI model?**
A: It's a Random Forest Classifier that takes waste parameters (moisture, contamination, quantity, category) and predicts the safest, most sustainable disposal method (Donation, Animal Feed, Biogas, or Compost).

**Q10: How do you estimate NPK in the recovery phase?**
A: If the model recommends "Compost", we use heuristic arrays based on the chemical proxies of the input category (e.g., Vegetables yield higher Nitrogen/Potassium) to estimate the fertilizer output.

## 4. Computer Vision (YOLO)
**Q11: What is YOLOv8 and why did you use it?**
A: YOLOv8 (You Only Look Once) is a state-of-the-art, real-time object detection model. We used it to automatically identify food from uploaded tray images, bypassing manual data entry.

**Q12: Which specific YOLO weights did you use?**
A: We used `yolov8n.pt` (YOLOv8 Nano) because it offers high-speed inference suitable for CPU environments without a dedicated GPU.

**Q13: What are the limitations of your YOLO implementation?**
A: Since it uses the pre-trained COCO dataset, it identifies generic macro-classes (like "bowl" or "sandwich") rather than specific Indian dishes (like "dosa").

**Q14: How does the backend process the image?**
A: The React frontend sends the image via `multipart/form-data`. FastAPI reads the bytes, passes them to OpenCV (`cv2`), scales the image, runs YOLO inference, draws bounding boxes, and saves the annotated artifact.

## 5. Explainable AI (XAI)
**Q15: What is SHAP?**
A: SHAP (SHapley Additive exPlanations) is a game-theoretic approach to explain the output of machine learning models.

**Q16: Why did you include SHAP in the Recovery routing?**
A: To provide transparency. For example, if the system rejects "Donation" and selects "Biogas", SHAP exposes that the `contamination_level` feature was the highest contributing factor to that decision.

## 6. Architecture & Backend (FastAPI)
**Q17: Why use FastAPI instead of Django or Flask?**
A: FastAPI is asynchronous by default, provides automatic Swagger UI documentation, and relies heavily on Pydantic for strict JSON validation, making it extremely fast for ML inference APIs.

**Q18: What is Pydantic's role in your project?**
A: It enforces strict data types for incoming API requests (e.g., ensuring `quantity_kg` is a float), rejecting bad requests automatically with a 422 error.

**Q19: How do you handle file uploads in FastAPI?**
A: Using `UploadFile` and `File(...)` parameters, allowing FastAPI to spool large image bytes efficiently before passing them to OpenCV.

## 7. Frontend (React & Animations)
**Q20: What libraries did you use for frontend styling and animations?**
A: Tailwind CSS for utility-first styling and Dark Mode, and Framer Motion for cinematic page transitions and animated component reveals.

**Q21: How are the Analytics charts generated?**
A: We used `recharts`. It dynamically maps to the aggregated JSON arrays returned by the FastAPI dashboard endpoints.

## 8. Database (MySQL & SQLAlchemy)
**Q22: Why use a relational database (MySQL) instead of MongoDB?**
A: Institutional logs are highly relational. A `food_waste_log` row is a parent that structurally maps 1-to-1 with a `waste_prediction` array and `image_metadata`, requiring strict SQL foreign keys.

**Q23: How do you store dish-level arrays in MySQL?**
A: We utilized SQLAlchemy's `JSON` column type in the `waste_predictions` table to store arbitrary arrays of dish recommendations without creating excessive bridging tables.

## 9. Security (JWT & RBAC)
**Q24: What is a JWT and how does it secure the application?**
A: A JSON Web Token (JWT) is an encoded string issued upon login. The frontend stores it and passes it in the `Authorization: Bearer` header. The backend validates the cryptographic signature before granting access.

**Q25: How are passwords stored?**
A: They are salted and hashed using Bcrypt (via `passlib`). Plaintext passwords are never stored in the database.

**Q26: What is Role-Based Access Control (RBAC)?**
A: It assigns distinct privileges based on the user's role. For instance, `Administrator` can fetch the `/users` registry, whereas a `Mess Manager` attempting the same route receives a 403 Forbidden error.

**Q27: How did you implement RBAC in FastAPI?**
A: By using a `Depends(get_current_admin_user)` middleware function on restricted endpoints.

## 10. Limitations & Future Scope
**Q28: What happens if an uploaded image has no food in it?**
A: YOLO returns an empty detection array. The React UI handles this gracefully by stating "No food objects detected" without crashing.

**Q29: What is the biggest limitation of your project right now?**
A: The reliance on proxy datasets. High-accuracy prediction requires real-world institutional telemetry (which is proprietary and difficult to obtain publicly).

**Q30: How would you improve this project in the future?**
A: Integrate IoT weighing scales directly onto dish-return counters to automate volume extraction, bypassing manual logging entirely. We would also fine-tune the YOLO model on a custom regional food dataset.
