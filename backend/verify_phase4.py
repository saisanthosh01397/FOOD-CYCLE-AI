import asyncio
import os
import cv2
import numpy as np

from main import app
from fastapi.testclient import TestClient
from database import engine

def create_dummy_image(path):
    img = np.random.randint(0, 256, (100, 100, 3), dtype=np.uint8)
    cv2.imwrite(path, img)

def test_endpoints():
    print("Testing Phase 4 Vision endpoints...")
    
    dummy_img_path = "test_image.jpg"
    create_dummy_image(dummy_img_path)
    
    client = TestClient(app)
    
    try:
        # 1. Test /vision/upload-image
        print("Testing Image Upload...")
        with open(dummy_img_path, "rb") as f:
            files = {"file": ("test_image.jpg", f, "image/jpeg")}
            resp = client.post("/vision/upload-image", files=files)
            
        assert resp.status_code == 200, f"Upload failed: {resp.text}"
        upload_data = resp.json()
        image_id = upload_data["image_id"]
        print(f"[OK] Upload Image passed (ID: {image_id})")

        # 2. Test /vision/detect-food
        print("Testing Food Detection...")
        resp = client.post(f"/vision/detect-food?image_id={image_id}")
        assert resp.status_code == 200, f"Detection failed: {resp.text}"
        detect_data = resp.json()
        assert "detections" in detect_data
        print(f"[OK] Detect Food passed (Found: {len(detect_data['detections'])} objects)")

        # 3. Test /vision/analyze-image
        print("Testing Full Analysis Pipeline...")
        with open(dummy_img_path, "rb") as f:
            files = {"file": ("test_image2.jpg", f, "image/jpeg")}
            data = {"quantity_kg": 5.0}
            resp = client.post("/vision/analyze-image", files=files, data=data)
            
        assert resp.status_code == 200, f"Analyze Image failed: {resp.text}"
        analyze_data = resp.json()
        assert "detected_category" in analyze_data
        assert "recovery_recommendation" in analyze_data
        print(f"[OK] Analyze Image passed")
        print(f"     => Detected Category: {analyze_data['detected_category']} (Conf: {analyze_data['confidence']})")
        print(f"     => Recommendation: {analyze_data['recovery_recommendation']}")
        print(f"     => XAI Reason: {analyze_data['explainable_ai_reason']}")

        print("\nAll Phase 4 endpoints verified successfully!")
        
    finally:
        if os.path.exists(dummy_img_path):
            os.remove(dummy_img_path)

if __name__ == "__main__":
    test_endpoints()
