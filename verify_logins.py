import requests
import sys

BASE_URL = "http://127.0.0.1:8000"

users_to_test = [
    {"email": "admin@foodcycleai.com", "password": "Admin@123"},
    {"email": "manager@foodcycleai.com", "password": "Manager@123"},
    {"email": "user@foodcycleai.com", "password": "User@123"}
]

print("Verifying logins...")
for user in users_to_test:
    res = requests.post(f"{BASE_URL}/auth/login", json={
        "email": user["email"],
        "password": user["password"]
    })
    
    if res.status_code == 200:
        data = res.json()
        print(f"SUCCESS: Logged in as {user['email']} (Role: {data['user']['role']})")
    else:
        print(f"FAILED: Failed to log in as {user['email']}. Status code: {res.status_code}")
        print(res.text)
        sys.exit(1)

print("\nAll accounts verified successfully.")
