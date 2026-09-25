# EVIDENCE INDEX

Use the manual capture checklist provided to generate the images below and place them in the `docs/screenshots/` directory.

| Evidence | Screenshot | Demonstrates |
|----------|------------|--------------|
| Landing | `docs/screenshots/01_landing.png` | Project concept, framer-motion AI animations |
| Login | `docs/screenshots/02_login.png` | Secure authentication UI without exposing passwords |
| Dashboard | `docs/screenshots/03_dashboard.png` | System overview, aggregated KPI metrics |
| Prediction Input | `docs/screenshots/04_prediction_input.png` | LightGBM parameters (Date, Phase, Weather) |
| Prediction Result | `docs/screenshots/05_prediction_result.png` | AI preparation planning, Random Forest dish-level arrays, Waste % |
| Vision Input | `docs/screenshots/06_vision_input.png` | Pre-analysis FormData upload boundary |
| Vision Result | `docs/screenshots/07_vision_result.png` | Computer vision, YOLOv8 bounding boxes, Confidence parameters |
| Recovery | `docs/screenshots/08_recovery.png` | Resource recovery, SHAP reasoning, NPK chemical extraction metrics |
| Analytics | `docs/screenshots/09_analytics.png` | Data analysis, React Recharts using actual MySQL data logs |
| History | `docs/screenshots/10_history.png` | Persistence, relational mapping of Predictions & Images to Food Logs |
| Users | `docs/screenshots/11_users.png` | RBAC, Administrator role isolation |
| Settings | `docs/screenshots/12_settings.png` | Application configuration interface |

### MANUAL CAPTURE CHECKLIST

Because automated headless browser capture is not available locally for this workspace, please perform the following manual screenshot captures (using `Win + Shift + S` or MacOS `Cmd + Shift + 4`):

1. **`01_landing.png`**: Open `http://localhost:5173/`. Capture the full screen when the "Circular AI Pipeline" glowing nodes are visible.
2. **`02_login.png`**: Click "Initialize Platform". Capture the login form completely empty (no passwords).
3. **`03_dashboard.png`**: Log in as `admin@foodcycleai.com`. Capture the 4 top KPI cards (Total Logged, CO2 Mitigated, etc.).
4. **`04_prediction_input.png`**: Navigate to "AI Forecast". Capture the form with parameters filled in, but before clicking generate.
5. **`05_prediction_result.png`**: Click Generate. Capture the JSON-rendered dish cards below the form showing "Recommended Prep", "Expected Consumption", and "Preventive Actions".
6. **`06_vision_input.png`**: Navigate to "Vision Engine". Capture the file dropzone with an image loaded.
7. **`07_vision_result.png`**: Click Analyze. Capture the annotated image displaying the drawn bounding boxes and the confidence score badge.
8. **`08_recovery.png`**: Navigate to "Recovery Intelligence". Input "Vegetables" (20Kg) and analyze. Capture the "Recovery Route" card and the resulting Nitrogen/Phosphorus/Potassium stats.
9. **`09_analytics.png`**: Navigate to "Analytics & Reports". Capture the main "Waste Volume vs Recovery" AreaChart with actual log data plotted.
10. **`10_history.png`**: Navigate to "Food Ledger". Capture the table rows showing the previous prediction and recovery results saved from earlier steps.
11. **`11_users.png`**: Navigate to "Access Control". Capture the user table displaying the Administrator and Mess Manager roles.
12. **`12_settings.png`**: Navigate to "System Settings". Capture the final UI.

*Ensure no `.env` data, network headers with raw JWTs, or passwords appear in any captures.*
