import os
import re

# 1. Fix Dashboard.jsx
dashboard_path = 'frontend/src/pages/Dashboard.jsx'
with open(dashboard_path, 'r', encoding='utf-8') as f:
    dashboard_content = f.read()

# Fix XAxis and Area for weekly_trend
dashboard_content = dashboard_content.replace('XAxis dataKey="date"', 'XAxis dataKey="name"')
dashboard_content = dashboard_content.replace('Area type="monotone" dataKey="quantity"', 'Area type="monotone" dataKey="waste"')

# Fix total_carbon_saved -> carbon_saved
dashboard_content = dashboard_content.replace('value={analytics?.kpis?.total_carbon_saved || 0}', 'value={analytics?.kpis?.carbon_saved || 0}')

with open(dashboard_path, 'w', encoding='utf-8') as f:
    f.write(dashboard_content)

# 2. Fix PredictionPage.jsx
prediction_path = 'frontend/src/pages/PredictionPage.jsx'
with open(prediction_path, 'r', encoding='utf-8') as f:
    prediction_content = f.read()

prediction_content = prediction_content.replace('predicted: response.data.predicted_kg,', 'predicted: response.data.predicted_quantity,')
prediction_content = prediction_content.replace('result.baseline_kg.toFixed(1)', 'result.confidence_score.toFixed(2)')
prediction_content = prediction_content.replace('Estimated baseline waste:', 'Confidence Score:')
prediction_content = prediction_content.replace('result.predicted_kg', 'result.predicted_quantity')

with open(prediction_path, 'w', encoding='utf-8') as f:
    f.write(prediction_content)

# 3. Fix RecoveryPage.jsx
recovery_path = 'frontend/src/pages/RecoveryPage.jsx'
with open(recovery_path, 'r', encoding='utf-8') as f:
    recovery_content = f.read()

recovery_content = recovery_content.replace('liveRec.recommendation', 'liveRec.recommended_method')
recovery_content = recovery_content.replace('liveRec.confidence', 'liveRec.confidence_score')
recovery_content = recovery_content.replace('liveRec.carbon_saving_kg.toFixed(1)', '(liveRec.npk_estimation?.nitrogen || 0).toFixed(1)')
recovery_content = recovery_content.replace('CO₂ Offset', 'Nitrogen (N)')
recovery_content = recovery_content.replace(' kg</p>', ' g</p>')

with open(recovery_path, 'w', encoding='utf-8') as f:
    f.write(recovery_content)

# 4. Fix VisionPage.jsx
vision_path = 'frontend/src/pages/VisionPage.jsx'
with open(vision_path, 'r', encoding='utf-8') as f:
    vision_content = f.read()

vision_content = vision_content.replace('result.detections', 'result.all_detections')
vision_content = vision_content.replace('result.category', 'result.detected_category')
vision_content = vision_content.replace('d.class_name', 'd.raw_class')
vision_content = vision_content.replace('result.estimated_n', 'result.npk_values?.nitrogen')
vision_content = vision_content.replace('result.estimated_p', 'result.npk_values?.phosphorus')
# Wait, for BoundingBox, we also need to change how bbox is passed.
vision_content = vision_content.replace('box.x1', 'bbox[0]')
vision_content = vision_content.replace('box.y1', 'bbox[1]')
vision_content = vision_content.replace('box.x2', 'bbox[2]')
vision_content = vision_content.replace('box.y2', 'bbox[3]')

with open(vision_path, 'w', encoding='utf-8') as f:
    f.write(vision_content)

print("Fixed mismatches!")
