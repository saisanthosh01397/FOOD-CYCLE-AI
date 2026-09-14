import requests

url = "http://localhost:8000/auth/login"
payload = {
    "email": "admin@foodcycleai.com",
    "password": "Admin@123"
}

try:
    response = requests.post(url, json=payload)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
