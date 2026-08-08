import requests
import time

BASE_URL = "http://127.0.0.1:8000"

def run_tests():
    print("Testing RBAC implementation...")

    # 1. Register First User (Should be Administrator)
    print("\n--- Registering First User ---")
    res1 = requests.post(f"{BASE_URL}/auth/register", json={
        "email": "admin@example.com",
        "password": "SecurePassword123!",
        "full_name": "Admin User"
    })
    print(f"Register Admin: {res1.status_code}")
    
    # 2. Register Second User (Should be Mess Manager)
    print("\n--- Registering Second User ---")
    res2 = requests.post(f"{BASE_URL}/auth/register", json={
        "email": "manager@example.com",
        "password": "SecurePassword123!",
        "full_name": "Mess Manager"
    })
    print(f"Register Manager: {res2.status_code}")

    # 3. Login Admin
    print("\n--- Logging in Admin ---")
    login_admin = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "admin@example.com",
        "password": "SecurePassword123!"
    })
    admin_data = login_admin.json()
    admin_token = admin_data.get("access_token")
    print(f"Admin Login Role: {admin_data.get('user', {}).get('role')}")

    # 4. Login Manager
    print("\n--- Logging in Manager ---")
    login_manager = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "manager@example.com",
        "password": "SecurePassword123!"
    })
    manager_data = login_manager.json()
    manager_token = manager_data.get("access_token")
    print(f"Manager Login Role: {manager_data.get('user', {}).get('role')}")

    # 5. Admin Access Users Endpoint
    print("\n--- Admin Accessing /users ---")
    users_req = requests.get(f"{BASE_URL}/users", headers={"Authorization": f"Bearer {admin_token}"})
    print(f"Admin GET /users Status: {users_req.status_code}")
    print(f"Users found: {len(users_req.json()) if users_req.status_code == 200 else users_req.json()}")

    # 6. Manager Access Users Endpoint (Should Fail)
    print("\n--- Manager Accessing /users ---")
    mgr_users_req = requests.get(f"{BASE_URL}/users", headers={"Authorization": f"Bearer {manager_token}"})
    print(f"Manager GET /users Status: {mgr_users_req.status_code} (Expected 403)")

    # 7. Manager trying to demote Admin
    if users_req.status_code == 200:
        admin_id = users_req.json()[0]['id']
        mgr_demote = requests.put(f"{BASE_URL}/users/{admin_id}/role", json={"role": "Mess Manager"}, headers={"Authorization": f"Bearer {manager_token}"})
        print(f"Manager Demote Admin Status: {mgr_demote.status_code} (Expected 403)")

    # 8. Admin trying to demote themselves (Should Fail because they are the last Admin)
    if users_req.status_code == 200:
        admin_id = users_req.json()[0]['id']
        admin_demote = requests.put(f"{BASE_URL}/users/{admin_id}/role", json={"role": "Mess Manager"}, headers={"Authorization": f"Bearer {admin_token}"})
        print(f"Admin Demoting Self (Only Admin) Status: {admin_demote.status_code} (Expected 400)")
        
    print("\nAll automated backend RBAC tests complete.")

if __name__ == "__main__":
    run_tests()
