import os
from sqlalchemy.orm import Session
from database.session import engine, Base, SessionLocal
from models.user import User, UserRole
from models.goal import Goal, GoalStatus
from auth.dependencies import hash_password
import uuid

def init_db():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if users already exist
        if db.query(User).count() > 0:
            print("Database already seeded. Skipping.")
            return

        print("Seeding users...")
        
        # Create Admin
        admin = User(
            name="Admin User",
            email="admin@atomquest.com",
            hashed_password=hash_password("admin123"),
            role=UserRole.admin,
            department="Operations"
        )
        db.add(admin)
        
        # Create Manager
        manager = User(
            name="Manager User",
            email="manager@atomquest.com",
            hashed_password=hash_password("manager123"),
            role=UserRole.manager,
            department="Engineering"
        )
        db.add(manager)
        db.commit()
        db.refresh(manager)

        # Create Employee
        employee = User(
            name="Employee User",
            email="employee@atomquest.com",
            hashed_password=hash_password("employee123"),
            role=UserRole.employee,
            department="Engineering",
            manager_id=manager.id
        )
        db.add(employee)
        db.commit()
        db.refresh(employee)
        
        print("Seeding goals...")
        
        goal = Goal(
            user_id=employee.id,
            title="Launch AtomQuest v1.0",
            description="Successfully launch the portal and get 500 active users.",
            thrust_area="Product",
            weightage=50,
            quarter="Q2 2026",
            status=GoalStatus.approved,
            approved=True
        )
        db.add(goal)
        db.commit()
        
        print("Seeding completed successfully.")
        print(f"Test Credentials:")
        print(f"Employee: employee@atomquest.com / employee123")
        print(f"Manager: manager@atomquest.com / manager123")
        print(f"Admin: admin@atomquest.com / admin123")

    finally:
        db.close()

if __name__ == "__main__":
    init_db()
