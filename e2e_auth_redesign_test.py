import requests
import time
import subprocess
import os
import sys

BASE_URL = "http://127.0.0.1:8000"

def run_tests():
    print("Testing Redesigned Authentication and User Management...")

    # 1. Login with Default Admin
    print("\n--- Testing Default Admin Login ---")
    admin_login = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "admin@foodcycleai.com",
        "password": "FoodCycle@2026"
    })
    
    if admin_login.status_code != 200:
        print(f"FAILED: Default Admin login failed with status {admin_login.status_code}")
        sys.exit(1)
        
    admin_data = admin_login.json()
    admin_token = admin_data.get("access_token")
    admin_role = admin_data.get("user", {}).get("role")
    
    if admin_role != "Administrator":
        print(f"FAILED: Default admin role is {admin_role}, expected Administrator")
        sys.exit(1)
        
    print("SUCCESS: Default Admin logged in.")

    # 2. Test Website Registration (Should be Mess Manager)
    print("\n--- Testing Website Registration ---")
    res_reg = requests.post(f"{BASE_URL}/auth/register", json={
        "email": "newuser@example.com",
        "password": "SecurePassword123!",
        "full_name": "New User"
    })
    
    if res_reg.status_code != 201:
        print(f"FAILED: Registration failed with {res_reg.status_code}")
        sys.exit(1)
        
    reg_role = res_reg.json().get("role")
    if reg_role != "Mess Manager":
        print(f"FAILED: New user registered as {reg_role}, expected Mess Manager")
        sys.exit(1)
    
    print("SUCCESS: Website registration correctly assigns Mess Manager.")

    # 3. Test Admin Creating User
    print("\n--- Testing Admin Add User ---")
    res_add = requests.post(f"{BASE_URL}/users", json={
        "email": "created@example.com",
        "password": "SecurePassword123!",
        "full_name": "Created Admin",
        "role": "Administrator"
    }, headers={"Authorization": f"Bearer {admin_token}"})
    
    if res_add.status_code != 201:
        print(f"FAILED: Admin creating user failed with {res_add.status_code}")
        sys.exit(1)
        
    print("SUCCESS: Admin successfully created an Administrator.")

    # 4. Login as Created Admin
    print("\n--- Testing Created Admin Login ---")
    created_login = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "created@example.com",
        "password": "SecurePassword123!"
    })
    
    if created_login.status_code != 200:
        print(f"FAILED: Created user login failed with {created_login.status_code}")
        sys.exit(1)
        
    print("SUCCESS: Created Administrator logged in.")

    # 5. Deactivate User
    print("\n--- Testing Deactivated User Login ---")
    users = requests.get(f"{BASE_URL}/users", headers={"Authorization": f"Bearer {admin_token}"}).json()
    newuser_id = next(u['id'] for u in users if u['email'] == "newuser@example.com")
    
    res_deactivate = requests.put(f"{BASE_URL}/users/{newuser_id}/status", json={"is_active": False}, headers={"Authorization": f"Bearer {admin_token}"})
    if res_deactivate.status_code != 200:
        print("FAILED: Could not deactivate user.")
        sys.exit(1)
        
    res_inactive_login = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "newuser@example.com",
        "password": "SecurePassword123!"
    })
    
    if res_inactive_login.status_code != 403:
        print(f"FAILED: Inactive user logged in! Status: {res_inactive_login.status_code}")
        sys.exit(1)
        
    print("SUCCESS: Inactive user was correctly rejected from logging in.")

    # 6. Test create_user.py Script (via Popen if possible, or just note it's manual)
    print("\nAll automated auth tests completed successfully.")

if __name__ == "__main__":
    run_tests()
