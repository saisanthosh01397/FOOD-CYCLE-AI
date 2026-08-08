# FoodCycle AI

Predict • Recover • Impact

FoodCycle AI is an AI-powered Decision Support System for food waste prediction and resource recovery.

## Architecture Overview
This project structure includes a complete FastAPI backend and a modern React frontend dashboard. 

### Phase 3: AI Pipeline
Phase 3 introduces a complete Machine Learning pipeline with synthetic dataset generation, automated preprocessing, Exploratory Data Analysis (EDA), and trained model integration (Prophet, Random Forest, XGBoost) directly into the FastAPI endpoints, featuring SHAP-powered Explainable AI (XAI).

### Phase 4: Computer Vision
Phase 4 implements a Computer Vision module to detect food categories from uploaded images using **Ultralytics YOLOv8**. Images are securely uploaded, scaled, and analyzed. COCO classes are intelligently mapped to FoodCycle categories, and bounding-box annotated results are saved to the server. The vision pipeline integrates directly with the Phase 3 Recovery AI.

### Phase 5: React Frontend
Phase 5 introduces the user-facing **Dashboard** built on **React and Vite**. It utilizes **Tailwind CSS** with glassmorphism aesthetics and features complex Recharts visualizations, drag-and-drop Image Analysis zones, and comprehensive historical logs with PDF/CSV exports. The frontend communicates with the backend seamlessly using Vite proxies.

## Folder Structure

```
FoodCycleAI/
├── backend/            # FastAPI Backend
│   ├── alembic/        # Database migrations
│   ├── api/
│   ├── config/         # JSON Configurations (food_mapping.json)
│   ├── logs/           # Python logging directory
│   ├── models/         # SQLAlchemy ORM Models
│   ├── routers/        # FastAPI Routers
│   ├── schemas/        # Pydantic Schemas
│   ├── services/       # Business Logic
│   ├── uploads/        # Media Storage
│   │   ├── images/     # Original Uploaded Images
│   │   ├── results/    # Bounding-Box Annotated Images
│   │   └── temp/       # Temporary Processing Directory
│   ├── utils/
│   ├── .env            # Environment variables (MySQL Credentials)
│   ├── alembic.ini
│   ├── config.py       # Configuration settings
│   ├── database.py     # Database engine & session
│   ├── main.py         # FastAPI App Entrypoint
│   └── requirements.txt
├── database/           # Database setup and scripts
├── datasets/           # Datasets
│   ├── metadata/       # Generation parameters & timestamps
│   ├── processed/      # Cleaned & scaled CSVs
│   └── raw/            # Generated synthetic CSVs
├── docs/               # Documentation
│   ├── eda/            # EDA charts and reports
│   └── model_reports/  # Cross-validation metrics, Feature Importance, Confusion Matrices
├── frontend/           # React Frontend (Vite + Tailwind)
│   ├── src/
│   │   ├── components/ # Reusable UI pieces (Sidebar, Layout)
│   │   ├── context/    # React Contexts (AuthContext)
│   │   ├── pages/      # Route Pages (Dashboard, Vision, Prediction)
│   │   └── utils/      # Helpers (Axios API config)
│   ├── index.html
│   └── vite.config.js
├── models/             # ML Models
│   ├── saved_models/   # Serialized .pkl files (Prophet, RF, XGB, Scalers, Encoders)
│   └── scripts/        # ML Pipeline scripts (generation, preprocess, eda, training)
└── README.md
```

## Technologies

*   **Frontend**: React, Vite, Tailwind CSS, Recharts, Framer Motion, React-Hook-Form, jsPDF
*   **Backend**: FastAPI, Python 3, SQLAlchemy, Pydantic, Alembic, Passlib, python-jose, python-multipart
*   **Database**: MySQL
*   **AI/ML**: Scikit-Learn, XGBoost, Prophet, Pandas, Matplotlib, Seaborn, SHAP, Joblib
*   **Computer Vision**: Ultralytics YOLOv8, OpenCV (cv2)

## Installation

### Prerequisites
*   Node.js (v18+) & npm
*   Python 3.x
*   MySQL Server

### 1. Backend Setup
1. Open terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # Activate virtual environment
   # Windows:
   venv\Scripts\activate
   # Linux/Mac:
   # source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy `backend/.env.example` to `backend/.env` and update the `MYSQL_PASSWORD` to match your local MySQL server.
5. Apply database migrations to create the tables:
   ```bash
   alembic upgrade head
   ```

### 2. Frontend Setup
1. Open a **new** terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```

## Run Commands

You must run BOTH the backend and frontend servers simultaneously in separate terminal windows.

### Terminal 1: Start Backend API Server
```bash
cd backend
# Make sure your virtual environment is active
uvicorn main:app --reload
```

### Terminal 2: Start Frontend Application
```bash
cd frontend
npm run dev
```

### Accessing the Application
Once both servers are running:
- **Frontend Application**: [http://localhost:5173](http://localhost:5173)
- **Backend Swagger API Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
