from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, SecurityScopes
from config import get_env_variable
import jwt
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.db import get_db
from app.core.db.models import User
from datetime import datetime, timezone, timedelta
import bcrypt

from .validators import (
    JWTToken,
    RequestUser,
    DataToEncode,
)

from ..db.models import (
    USER_SCOPE,
    TOKEN_TYPE
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login", scopes={
    "admin": "Is website admin"
})


JWT_SECRET = get_env_variable("JWT_SECRET")
ALGORITHM = "HS256"

def decode_token(token: str) -> JWTToken:
    decoded_token = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    try:
        validated_token = JWTToken.model_validate(
            {
                "id": decoded_token["sub"],
                "exp": decoded_token["exp"],
                "type": decoded_token["token_type"],
                "scopes": decoded_token["scopes"].split(" ")
            }
        )
        return validated_token
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=440, detail="Token expired")
    except ValidationError:
        raise HTTPException(401, detail="Token malformed")
    
def encode_token(data: DataToEncode, token_type: TOKEN_TYPE):
    to_encode = data.model_dump(mode='json')
    scopes: list[str] = []
    # pass admin scope for admin_user
    if data.sub == '0078e384708140fdba9ac83a7507dc83':
        scopes.append('admin')

    to_encode.update({ 'exp': datetime.now(tz=timezone.utc) + timedelta(weeks=2), 'scopes': ' '.join(scopes), 'token_type': token_type })
    return jwt.encode(to_encode, JWT_SECRET, "HS256"), scopes

def create_access_token(data: DataToEncode):
    return encode_token(data, TOKEN_TYPE.ACCESS)

def create_refresh_token(data: DataToEncode):
    return encode_token(data, TOKEN_TYPE.REFRESH)

def verify_passwords(pwd1: str, pwd2: str) -> bool:
    return bcrypt.checkpw(pwd1.encode("utf-8"), pwd2.encode("utf-8"))


async def get_current_user(security_scopes: SecurityScopes, token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)) -> RequestUser:
    # Scopes validation
    if security_scopes.scopes:
        authenticate_value = f'Bearer scope="{security_scopes.scope_str}"'
    else:
        authenticate_value = "Bearer"
    headers={ "WWW-Authenticate": authenticate_value }

    user = decode_token(token)
    
    find_user_by_id = select(User).where(User.id == user.id)
    db_user = await db.scalar(find_user_by_id)


    if db_user is None:
        raise HTTPException(
            detail="No user found with this token",
            status_code=401,
            headers=headers
        )
    
    valid_scopes = []
    for scope_str in user.scopes:
        if scope_str in USER_SCOPE:  # Uses your custom __contains__
            valid_scopes.append(USER_SCOPE(scope_str))
    
    return RequestUser(
        email= db_user.email,
        username= db_user.username,
        id=db_user.id,
        scopes=valid_scopes
    )
