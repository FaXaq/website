from sqlalchemy import select
from pydantic import EmailStr
from sqlalchemy.orm import Session
from app.services.db import engine
from app.services.db.models import User
import bcrypt
from fastapi import APIRouter, HTTPException
from config import get_env_variable
from .validators import LoginUser, LoginUserResponse
import jwt
from datetime import timezone, datetime, timedelta

router = APIRouter(
    prefix="/auth",
    tags=["users"]
)

JWT_SECRET = get_env_variable("JWT_SECRET")

@router.post("/login", response_model=LoginUserResponse)
async def login_user(user: LoginUser):
    response = []
    with Session(engine) as session:
        db_user = session.query(User).where(User.email == user.email).first()
        
        if db_user is None:
            raise HTTPException(404)
        is_password_ok = bcrypt.checkpw(user.password.encode("utf-8"), db_user.password_hash.encode("utf-8"))
        
        if is_password_ok is False:
            raise HTTPException(401)

        jwt_token = jwt.encode({ "id": db_user.id, "exp": datetime.now(tz=timezone.utc) + timedelta(weeks=2) }, JWT_SECRET, "HS256")

        response = LoginUserResponse(
            email=db_user.email,
            username=db_user.username,
            id=db_user.id,
            token=jwt_token
        )
        session.close()
    return response