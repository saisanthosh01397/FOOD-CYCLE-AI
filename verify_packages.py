import sys
import importlib

packages = [
    "fastapi", "uvicorn", "sqlalchemy", "pydantic", "pymysql", "dotenv",
    "sklearn", "prophet", "pandas", "numpy", "cv2", "ultralytics", "joblib"
]

missing = []
for pkg in packages:
    try:
        importlib.import_module(pkg)
        print(f"[OK] {pkg}")
    except ImportError:
        missing.append(pkg)
        print(f"[FAIL] {pkg}")

if missing:
    print(f"Missing packages: {', '.join(missing)}")
    sys.exit(1)
else:
    print("All backend packages installed successfully!")
    sys.exit(0)
