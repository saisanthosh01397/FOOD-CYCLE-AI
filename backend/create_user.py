import os
import sys

# Add the current directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal
from models.user import User, UserRole
from services.auth_service import get_password_hash

def create_user():
    print("--- Create New User ---")
    full_name = input("Enter Full Name: ").strip()
    email = input("Enter Email: ").strip()
    password = input("Enter Password: ").strip()
    
    role_input = input("Enter Role (1 for Administrator, 2 for Mess Manager) [default: 2]: ").strip()
    
    role = UserRole.administrator if role_input == '1' else UserRole.mess_manager
    
    if not full_name or not email or not password:
        print("Error: Full Name, Email, and Password are required.")
        return

    db = SessionLocal()
    try:
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            print("Error: User with this email already exists.")
            return

        hashed_password = get_password_hash(password)
        new_user = User(
            full_name=full_name,
            email=email,
            password_hash=hashed_password,
            role=role
        )
        db.add(new_user)
        db.commit()
        print(f"Success: User {email} created successfully as {role.value}.")
    except Exception as e:
        print(f"An error occurred: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_user()
