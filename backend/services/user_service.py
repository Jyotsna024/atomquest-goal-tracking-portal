from typing import Optional, List
from uuid import UUID
from sqlalchemy.orm import Session

from models.user import User, UserRole
from schemas.user import UserCreate, UserUpdate
from auth.dependencies import hash_password
from core.exceptions import NotFoundException, ConflictException


class UserService:
    @staticmethod
    def get_by_id(db: Session, user_id: UUID) -> User:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise NotFoundException("User")
        return user

    @staticmethod
    def get_by_email(db: Session, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def get_all(db: Session, role: Optional[str] = None, department: Optional[str] = None,
                skip: int = 0, limit: int = 100) -> tuple[List[User], int]:
        query = db.query(User)
        if role:
            query = query.filter(User.role == role)
        if department:
            query = query.filter(User.department == department)
        total = query.count()
        users = query.order_by(User.name).offset(skip).limit(limit).all()
        return users, total

    @staticmethod
    def create(db: Session, data: UserCreate) -> User:
        existing = db.query(User).filter(User.email == data.email).first()
        if existing:
            raise ConflictException("User with this email already exists")

        user = User(
            name=data.name,
            email=data.email,
            hashed_password=hash_password(data.password),
            role=UserRole(data.role),
            department=data.department,
            designation=data.designation,
            manager_id=data.manager_id,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def update(db: Session, user_id: UUID, data: UserUpdate) -> User:
        user = UserService.get_by_id(db, user_id)
        update_data = data.model_dump(exclude_unset=True)
        if "role" in update_data:
            update_data["role"] = UserRole(update_data["role"])
        for key, value in update_data.items():
            setattr(user, key, value)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def get_team_members(db: Session, manager_id: UUID) -> List[User]:
        return db.query(User).filter(User.manager_id == manager_id).order_by(User.name).all()
