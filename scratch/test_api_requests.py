import requests

res = requests.post("http://127.0.0.1:8000/auth/login", data={"username": "admin@foodcycle.ai", "password": "securepassword123"})
if res.status_code == 200:
    token = res.json()["access_token"]
    pred = requests.post("http://127.0.0.1:8000/prediction", json={
        "date": "2024-09-17",
        "meal_type": "lunch",
        "people": 150,
        "weather": "sunny",
        "special_event": "none"
    }, headers={"Authorization": f"Bearer {token}"})
    print(pred.json())
else:
    print(res.text)
