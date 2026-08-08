import os
import sys

# Add the current directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal
from models.user import User, UserRole, UserActivityLog
from services.auth_service import get_password_hash

def seed_users():
    db = SessionLocal()
    try:
        # Clear existing logs to prevent foreign key errors
        print("Clearing existing activity logs...")
        db.query(UserActivityLog).delete()
        
        # Clear existing users
        print("Clearing existing users...")
        db.query(User).delete()
        db.commit()

        # Users to create
        users_to_seed = [
            {
                "full_name": "Administrator",
                "email": "admin@foodcycleai.com",
                "password": "Admin@123",
                "role": UserRole.administrator
            },
            {
                "full_name": "Mess Manager",
                "email": "manager@foodcycleai.com",
                "password": "Manager@123",
                "role": UserRole.mess_manager
            },
            {
                "full_name": "General User",
                "email": "user@foodcycleai.com",
                "password": "User@123",
                "role": UserRole.mess_manager  # Using Mess Manager as the standard User role
            }
        ]

        print("Creating new accounts...")
        for u in users_to_seed:
            hashed_pw = get_password_hash(u["password"])
            db_user = User(
                full_name=u["full_name"],
                email=u["email"],
                password_hash=hashed_pw,
                role=u["role"]
            )
            db.add(db_user)
            print(f"Created {u['email']} as {u['role'].value}")

        db.commit()
        print("Successfully replaced all users.")

    except Exception as e:
        print(f"An error occurred: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_users()
