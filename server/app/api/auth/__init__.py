from app.core.db.models import User, BlacklistedToken, TOKEN_TYPE
from fastapi import APIRouter, HTTPException, Depends, Cookie, Response
from fastapi.security import OAuth2PasswordRequestForm
from .validators import (
    LoginUserResponse,
)
from app.core.auth.validators import (
    DataToEncode
)
from app.core.auth import (
    create_refresh_token,
    create_access_token,
    verify_passwords,
    oauth2_scheme
)

from app.core.db import get_db
from sqlalchemy.ext.asyncio.session import AsyncSession
from sqlalchemy import select, delete

from typing import Optional
from jose import JWTError

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

@router.post("/login", response_model=LoginUserResponse)
async def login_user(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    response = []
    stmt = select(User).where(User.email == form_data.username)
    db_user = await db.scalar(stmt)
    
    if db_user is None:
        raise HTTPException(404)
    
    is_password_ok = verify_passwords(form_data.password, db_user.password_hash)
    
    if is_password_ok is False:
        raise HTTPException(401)

    access_token, scopes = create_access_token(DataToEncode(sub=db_user.id))
    refresh_token, scopes = create_refresh_token(DataToEncode(sub=db_user.id))

    response = LoginUserResponse(
        email=db_user.email,
        access_token=access_token,
        refresh_token=refresh_token,
        scopes=scopes
    )
    return response

@router.post("/logout")
async def logout_user(
    response: Response,
    access_token: str = Depends(oauth2_scheme),
    refresh_token: Optional[str] = Cookie(None, alias="refresh_token"),
    db: AsyncSession = Depends(get_db)
):
    try:
        if not refresh_token:
            raise HTTPException(status_code=401, detail="Refresh token not found")

        blacklist_access_token = delete(BlacklistedToken).where(BlacklistedToken.token == access_token and BlacklistedToken.type == TOKEN_TYPE.ACCESS)
        blacklist_refresh_token = delete(BlacklistedToken).where(BlacklistedToken.token == refresh_token and BlacklistedToken.type == TOKEN_TYPE.REFRESH)
        await db.execute(blacklist_access_token)
        await db.execute(blacklist_refresh_token)

        response.delete_cookie(key="refresh_token")

        return

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token.")