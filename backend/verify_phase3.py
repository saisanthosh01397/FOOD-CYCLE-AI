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
    print("Testing Phase 3 ML endpoints...")
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
        
        resp = await client.post("/auth/login", json={
            "full_name": "Test User",
            "email": unique_email,
            "password": "Password123!",
            "role": "Admin"
        })
        assert resp.status_code == 200, f"Login failed: {resp.text}"
        token = resp.json()["access_token"]
        print("[OK] Auth setup passed")

        # 3. Create a Food Log with extra Phase 3 parameters
        headers = {"Authorization": f"Bearer {token}"}
        resp = await client.post("/food-logs", json={
            "date": "2026-08-05",
            "meal_type": "Lunch",
            "food_category": "Vegetables",
            "quantity_kg": 15.0,
            "people_served": 100,
            "weather": "Sunny",
            "special_event": False
        }, headers=headers)
        assert resp.status_code == 201, f"Create Food Log failed: {resp.text}"
        log_id = resp.json()["id"]
        print("[OK] Create Food Log passed")

        # 4. Phase 3: AI Services
        # Prediction Endpoint
        resp = await client.post("/prediction", json={"log_id": log_id}, headers=headers)
        assert resp.status_code == 200, f"Prediction service failed: {resp.text}"
        pred_data = resp.json()
        assert "error" not in pred_data
        assert "predicted_quantity" in pred_data
        assert "confidence_score" in pred_data
        assert pred_data["predicted_quantity"] > 0
        print(f"[OK] Prophet Prediction passed (Forecast: {pred_data['predicted_quantity']} kg)")

        # Recovery Endpoint (with extra properties)
        log_data_with_extras = {
            "log_id": log_id,
            "food_category": "Vegetables",
            "quantity_kg": 15.0,
            "moisture": 85.0,
            "freshness": 90.0,
            "contamination_level": 2.0,
            "organic_percentage": 98.0
        }
        resp = await client.post("/recovery", json=log_data_with_extras, headers=headers)
        assert resp.status_code == 200, f"Recovery service failed: {resp.text}"
        rec_data = resp.json()
        assert "error" not in rec_data
        assert "recommended_method" in rec_data
        assert "xai" in rec_data
        assert "npk_estimation" in rec_data
        
        method = rec_data["recommended_method"]
        explanation = rec_data["xai"]["human_readable_explanation"]
        print(f"[OK] Recovery Recommendation passed")
        print(f"     => Method: {method}")
        print(f"     => NPK: {rec_data['npk_estimation']}")
        print(f"     => Explanation: {explanation}")

        # Cleanup
        resp = await client.delete(f"/food-logs/{log_id}", headers=headers)
        assert resp.status_code == 204, f"Delete Food Log failed: {resp.text}"
        
        print("\nAll Phase 3 endpoints verified successfully!")

if __name__ == "__main__":
    print("Testing DB Connection...")
    try:
        with engine.connect() as conn:
            pass
    except Exception as e:
        print(f"[FAIL] DB Connection failed: {e}")
        exit(1)

    server_process = Process(target=start_server)
    server_process.start()
    print("Starting server for tests...")
    
    time.sleep(4) # Give server time to load models
    
    try:
        asyncio.run(test_endpoints())
    finally:
        server_process.terminate()
        server_process.join()
        print("Server stopped.")
