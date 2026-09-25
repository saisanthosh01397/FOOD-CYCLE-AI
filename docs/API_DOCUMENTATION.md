# FOODCYCLE AI - API DOCUMENTATION

Base URL: `http://127.0.0.1:8000`

All protected routes require a JWT bearer token passed in the `Authorization: Bearer <token>` header.

| METHOD | ENDPOINT | PURPOSE | AUTH REQUIRED | RESPONSE |
|--------|----------|---------|---------------|----------|
| **POST** | `/auth/login` | Authenticate user and issue JWT token | No | `{"access_token": "jwt...", "token_type": "bearer", "user": {...}}` |
| **POST** | `/auth/register` | Register a new user | No | `UserResponse` JSON |
| **GET** | `/users` | List all users in the system | Yes (Admin Only) | Array of `UserResponse` |
| **PUT** | `/users/{id}` | Update user details/roles | Yes (Admin Only) | Updated `UserResponse` |
| **POST** | `/prediction` | Run LightGBM/RF pipeline to forecast demand and waste | Yes | `{"total_preparation_kg": 150.5, "items": [...], "preventive_actions": [...]}` |
| **POST** | `/vision/analyze-image` | Upload image (FormData) for YOLOv8 classification | Yes | `{"category": "Mixed", "confidence": 0.85, "annotated_image_url": "..."}` |
| **POST** | `/recovery` | Run XAI/SHAP on surplus food to route to sustainable pathways | Yes | `{"recommended_method": "Compost", "npk_estimation": {...}, "shap_values": [...]}` |
| **GET** | `/dashboard/analytics` | Fetch aggregated KPIs, weekly trends, and distributions | Yes | `{"kpis": {...}, "weekly_trend": [...], "category_distribution": [...]}` |
| **GET** | `/dashboard/system-health` | Fetch basic system diagnostics | Yes (Admin Only) | `{"database": "ok", "yolo": "ok", "active_users": 5}` |
| **GET** | `/history` | Fetch paginated operational ledger mapping Predictions/Recovery to Logs | Yes | `{"items": [...], "total": 10, "page": 1, "limit": 10}` |

## Error Responses
- **401 Unauthorized:** Missing or invalid JWT Token.
- **403 Forbidden:** Valid JWT, but role lacks permissions (e.g., Mess Manager calling `/users`).
- **422 Unprocessable Entity:** Invalid JSON payload / Pydantic validation failure.
- **500 Internal Server Error:** Critical failure (e.g., corrupted image passed to OpenCV).
