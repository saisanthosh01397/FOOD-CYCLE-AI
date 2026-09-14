import requests

url = "http://localhost:8000/auth/register"
payload = {
    "full_name": "Test User",
    "email": "test@foodcycleai.com",
    "password": "TestPassword@123"
}

try:
    response = requests.post(url, json=payload)
    print(f"Register Status: {response.status_code}")
    print(f"Register Response: {response.text}")

    if response.status_code == 201 or "Email already registered" in response.text:
        login_url = "http://localhost:8000/auth/login"
        login_payload = {
            "email": "test@foodcycleai.com",
            "password": "TestPassword@123"
        }
        login_response = requests.post(login_url, json=login_payload)
        print(f"Login Status: {login_response.status_code}")
        print(f"Login Response: {login_response.text}")
except Exception as e:
    print(f"Error: {e}")
