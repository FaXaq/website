from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.db import get_db
from app.core.db.models import User
import bcrypt
from fastapi import APIRouter, Depends, Security
from .validators import CreateUserRequest, CreateUserResponse, ListUsersResponse
from app.core.auth import get_current_user
from app.core.auth.validators import RequestUser

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.post("/", response_model=CreateUserResponse, dependencies=[Depends(get_current_user)])
async def create_user(user: CreateUserRequest, db: AsyncSession = Depends(get_db)):
    response = None
    password_hash = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
    new_user = User(
        username=user.username,
        email=user.email,
        password_hash=password_hash.decode('utf-8')
    )
    print(new_user.__dict__)
    db.add(new_user)
    await db.commit()
    response = CreateUserResponse.model_validate(new_user)
    return response

@router.get("/me", response_model=RequestUser, dependencies=[Depends(get_current_user)])
async def get_user_me(user=Security(get_current_user)):
    return user

@router.get("/", response_model=list[ListUsersResponse], dependencies=[Security(get_current_user, scopes=['admin'])])
async def get_users(db: AsyncSession = Depends(get_db)):
    select_users = select(User).limit(20)
    users = await db.scalars(select_users)
    return users
