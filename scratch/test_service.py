import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))
os.chdir('backend')

from services.prediction_service import prediction_service

result = prediction_service.predict({
    "date": "2024-09-17",
    "meal_type": "lunch",
    "people": 150,
    "weather": "sunny",
    "special_event": "none"
})
print("Result:")
print(result)
