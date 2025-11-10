from sqlalchemy.orm import Session
from app.services.db import engine
from app.services.db.models import User
import bcrypt
from fastapi import APIRouter, HTTPException, Request
from config import get_env_variable
from .validators import CreateUser, CreateUserResponse, ListUsersResponse
from starlette.authentication import requires
from app.middlewares.auth import AuthRequest

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.post("/", response_model=CreateUserResponse)
@requires(["authenticated", "admin"])
async def create_user(request: AuthRequest, user: CreateUser):
    response = None
    with Session(engine) as session:
        password_hash = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
        new_user = User(
            username=user.username,
            email=user.email,
            password_hash=password_hash.decode('utf-8')
        )
        print(new_user.__dict__)
        session.add(new_user)
        session.commit()
        response = CreateUserResponse.model_validate(new_user)
        session.close()
    return response

@router.get("/", response_model=list[ListUsersResponse])
@requires(["authenticated", "admin"])
def get_users(request: AuthRequest):
    with Session(engine) as session:
        users = session.query(User).limit(20)
        return users
