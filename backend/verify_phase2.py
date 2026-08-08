import asyncio
import httpx
import uvicorn
from multiprocessing import Process
import time

from main import app
from database import engine
from models.base import Base

def start_server():
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="error")

async def test_endpoints():
    print("Testing endpoints...")
    async with httpx.AsyncClient(base_url="http://127.0.0.1:8000") as client:
        # 1. Test Health
        resp = await client.get("/health")
        assert resp.status_code == 200, f"Health check failed: {resp.text}"
        print("[OK] Health check passed")

        # 2. Test Registration & Login
        unique_email = f"test_{int(time.time())}@example.com"
        resp = await client.post("/auth/register", json={
            "full_name": "Test User",
            "email": unique_email,
            "password": "Password123!",
            "role": "Admin"
        })
        assert resp.status_code == 201, f"Registration failed: {resp.text}"
        print("[OK] Registration passed")

        resp = await client.post("/auth/login", json={
            "full_name": "Test User", # Not strictly needed, just to pass validation if strictly enforcing UserCreate
            "email": unique_email,
            "password": "Password123!",
            "role": "Admin"
        })
        assert resp.status_code == 200, f"Login failed: {resp.text}"
        token = resp.json()["access_token"]
        print("[OK] Login passed")

        # 3. Test Food Logs CRUD
        headers = {"Authorization": f"Bearer {token}"}
        resp = await client.post("/food-logs", json={
            "date": "2026-08-05",
            "meal_type": "Lunch",
            "food_category": "Vegetables",
            "quantity_kg": 5.5,
            "people_served": 100,
            "weather": "Sunny",
            "special_event": False
        }, headers=headers)
        assert resp.status_code == 201, f"Create Food Log failed: {resp.text}"
        log_id = resp.json()["id"]
        print("[OK] Create Food Log passed")

        resp = await client.get("/food-logs", headers=headers)
        assert resp.status_code == 200, f"Get Food Logs failed: {resp.text}"
        assert len(resp.json()) > 0
        print("[OK] Get Food Logs passed")

        resp = await client.put(f"/food-logs/{log_id}", json={
            "date": "2026-08-05",
            "meal_type": "Dinner",
            "food_category": "Meat",
            "quantity_kg": 10.0,
            "people_served": 150,
            "weather": "Cloudy",
            "special_event": True
        }, headers=headers)
        assert resp.status_code == 200, f"Update Food Log failed: {resp.text}"
        assert resp.json()["meal_type"] == "Dinner"
        print("[OK] Update Food Log passed")

        # 4. AI Services (should return 'Model not trained yet' error message)
        resp = await client.post("/prediction", json={"log_id": log_id}, headers=headers)
        assert resp.status_code == 200, f"Prediction service failed: {resp.text}"
        assert "Model not trained yet" in resp.json().get("error", "")
        print("[OK] Prediction interface passed (Model not trained check)")

        resp = await client.post("/recovery", json={"log_id": log_id}, headers=headers)
        assert resp.status_code == 200, f"Recovery service failed: {resp.text}"
        assert "Model not trained yet" in resp.json().get("error", "")
        print("[OK] Recovery interface passed (Model not trained check)")

        # 5. Dashboard
        resp = await client.get("/dashboard", headers=headers)
        assert resp.status_code == 200, f"Dashboard failed: {resp.text}"
        print("[OK] Dashboard stats passed")

        # Cleanup
        resp = await client.delete(f"/food-logs/{log_id}", headers=headers)
        assert resp.status_code == 204, f"Delete Food Log failed: {resp.text}"
        print("[OK] Delete Food Log passed")
        
        print("\nAll endpoints verified successfully!")

if __name__ == "__main__":
    print("Testing DB Connection...")
    try:
        with engine.connect() as conn:
            print("[OK] DB Connection successful")
    except Exception as e:
        print(f"[FAIL] DB Connection failed: {e}")
        exit(1)

    server_process = Process(target=start_server)
    server_process.start()
    print("Starting server for tests...")
    
    # Wait for server to be ready
    import time
    time.sleep(3)
    
    try:
        asyncio.run(test_endpoints())
    finally:
        server_process.terminate()
        server_process.join()
        print("Server stopped.")
