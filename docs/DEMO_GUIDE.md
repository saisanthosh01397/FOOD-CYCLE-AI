# FOODCYCLE AI - DEMO GUIDE

Follow this exact sequence for a flawless live project demonstration.

### STEP 1: Landing Page
- **Action:** Open `http://localhost:5173/`.
- **Talking Point:** Explain the existing problem in institutional food management (inflexible menus, overproduction, blind waste disposal). Introduce FoodCycle AI as an enterprise platform integrating XGBoost forecasting, YOLOv8 vision, and SHAP-explained recovery routing to create a sustainable circular economy.

### STEP 2: Login & Dashboard
- **Action:** Click "Initialize Platform". Login with Administrator credentials (`admin@foodcycleai.com`).
- **Talking Point:** Highlight the JWT-based authentication. Showcase the Dashboard's high-level KPIs (Total Logged, CO2 Mitigated) which are aggregated live from MySQL. 

### STEP 3: Prediction (Dish-Level Forecasting)
- **Action:** Navigate to "AI Forecast" (Prediction). Enter a future date, select "Breakfast", input 200 for population, and select "Sunny". Click "Generate".
- **Talking Point:** Explain that the LightGBM model forecasts baseline demand, while the Random Forest Regressor translates this into dish-specific preparation weights. Point out the expected waste metric and actionable prevention steps (e.g., batch cooking) returned in the JSON payload. Emphasize that the result is saved automatically to the History ledger.

### STEP 4: Vision (Automated Detection)
- **Action:** Navigate to "Vision Engine". Upload a valid `.jpg` image of a food tray. 
- **Talking Point:** Explain that the system bypasses manual data entry using a YOLOv8 Nano object detection model running on OpenCV. Point out the rendered bounding boxes, the confidence score, and the categorized output (e.g., "Mixed" or "Vegetables"). 

### STEP 5: Recovery (Sustainability Routing)
- **Action:** Navigate to "Recovery Intelligence". Input "Vegetables", "20 Kg", and standard moisture levels. Click "Generate".
- **Talking Point:** Explain that the Random Forest Classifier evaluates the waste parameters to route it to the optimal sustainable pathway (Animal Feed, Compost, Biogas, or Donation). If Compost is chosen, highlight the Nitrogen/Phosphorus/Potassium (NPK) extraction. Mention that SHAP (Explainable AI) guarantees transparency in these decisions.

### STEP 6: Analytics
- **Action:** Navigate to "Analytics & Reports".
- **Talking Point:** Scroll through the Recharts visualizations. Emphasize that every chart (Weekly Trend, Meal Type Distribution) aggregates authentic backend data from the `food_waste_logs` MySQL table, representing true operational patterns.

### STEP 7: History (Distributed Ledger)
- **Action:** Navigate to "Food Ledger" (History).
- **Talking Point:** Show that the Prediction and Recovery analyses conducted in Steps 3 and 5 are preserved immutably. Demonstrate the search and filter functionalities.

### STEP 8: Users (RBAC Validation)
- **Action:** Navigate to "Access Control" (Users).
- **Talking Point:** Explain the implementation of Role-Based Access Control (RBAC). Mention that because you logged in as an Administrator, you can view the registry, whereas Mess Managers would receive a 403 Forbidden error.

### STEP 9: Logout
- **Action:** Click "Logout".
- **Talking Point:** The JWT token is securely purged from local storage, returning the system to the Landing Page.

## DEMO FALLBACK PLAN
If a live inference model fails (e.g., local machine runs out of memory for YOLOv8 or OpenCV fails to bind), do **NOT** attempt to fabricate the visual output.
1. Acknowledge the hardware timeout gracefully.
2. Navigate directly to the **History Ledger**.
3. Use the previously stored legitimate test records to prove the structural flow of the application.
4. Filter by the desired category and show the previously successful Prediction/Recovery outputs.
