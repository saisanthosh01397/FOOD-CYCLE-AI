import urllib.request
import json
import os

# Login
login_data = json.dumps({"username": "admin@foodcycle.ai", "password": "securepassword123"}).encode()
req = urllib.request.Request('http://localhost:8000/auth/login', data=login_data, headers={'Content-Type': 'application/x-www-form-urlencoded'})

# Actually FastAPI OAuth2 uses form data
import urllib.parse
data = urllib.parse.urlencode({"username": "admin@foodcycle.ai", "password": "securepassword123"}).encode()
req = urllib.request.Request('http://localhost:8000/auth/login', data=data)
try:
    response = urllib.request.urlopen(req)
    token = json.loads(response.read().decode())['access_token']
    
    # Predict
    pred_data = json.dumps({
        "date": "2024-09-17",
        "meal_type": "lunch",
        "people": 150,
        "weather": "sunny",
        "special_event": "none"
    }).encode()
    req_pred = urllib.request.Request(
        'http://localhost:8000/prediction', 
        data=pred_data, 
        headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {token}'}
    )
    res_pred = urllib.request.urlopen(req_pred)
    print(res_pred.read().decode())
    
except Exception as e:
    print(f"Error: {e}")
    if hasattr(e, 'read'):
        print(e.read().decode())
