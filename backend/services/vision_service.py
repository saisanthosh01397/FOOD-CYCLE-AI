import os
import json
import cv2
import logging
from ultralytics import YOLO

logger = logging.getLogger(__name__)

class VisionService:
    def __init__(self):
        self.model = None
        self.food_mapping = {}
        self.load_model()
        self.load_mapping()
        
    def load_model(self):
        try:
            # We use official pretrained yolov8n.pt. 
            # In the future, this can be swapped with a custom food-waste dataset path.
            model_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "yolov8n.pt")
            self.model = YOLO(model_path)
            logger.info(f"YOLOv8 model ({model_path}) loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load YOLO model: {e}")
            
    def load_mapping(self):
        mapping_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'config', 'food_mapping.json')
        try:
            if os.path.exists(mapping_path):
                with open(mapping_path, 'r') as f:
                    self.food_mapping = json.load(f)
                logger.info("Food mapping configuration loaded.")
            else:
                logger.warning(f"Mapping file not found at {mapping_path}")
        except Exception as e:
            logger.error(f"Failed to load food mapping: {e}")
            
    def resize_image(self, image_path, max_dim=800):
        img = cv2.imread(image_path)
        if img is None:
            raise ValueError("Invalid image or could not read the file.")
            
        h, w = img.shape[:2]
        if max(h, w) > max_dim:
            scale = max_dim / max(h, w)
            new_w, new_h = int(w * scale), int(h * scale)
            img = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_AREA)
            cv2.imwrite(image_path, img)
        return img
        
    def map_category(self, detected_name):
        return self.food_mapping.get(detected_name.lower())
        
    def detect_food(self, image_path, result_path, conf_threshold=0.25):
        if self.model is None:
            raise RuntimeError("YOLO model not loaded.")
            
        # 1. Resize for performance
        img = self.resize_image(image_path)
        
        # 2. Run inference
        results = self.model(img, conf=conf_threshold)
        
        detected_objects = []
        
        if len(results) > 0:
            result = results[0]
            
            # Save annotated image
            annotated_img = result.plot()
            cv2.imwrite(result_path, annotated_img)
            
            for box in result.boxes:
                cls_id = int(box.cls[0])
                conf = float(box.conf[0])
                cls_name = result.names[cls_id]
                
                mapped_cat = self.map_category(cls_name)
                
                # If mapped_cat is None, it means YOLO recognized an object (e.g. 'person') but it's not in our food mapping
                if mapped_cat is None:
                    continue
                    
                detected_objects.append({
                    "raw_class": cls_name,
                    "food_category": mapped_cat,
                    "confidence": round(conf, 2),
                    "bbox": box.xyxy[0].tolist()
                })
                
        if not detected_objects:
            # If nothing detected > conf_threshold or detected non-food objects
            cv2.imwrite(result_path, img)
            return []
            
        return detected_objects

vision_service = VisionService()
