from fastapi import FastAPI, Request, HTTPException
from config import get_env_variable
import jwt
from pydantic import BaseModel, EmailStr, ValidationError
from sqlalchemy.orm import Session
from app.services.db import engine
from app.services.db.models import User
from starlette.authentication import (
    AuthenticationBackend, 
    AuthenticationError,
    AuthCredentials,
    BaseUser
)
from starlette.requests import Request as StarletteRequest
from starlette.middleware.authentication import AuthenticationMiddleware
from starlette.responses import JSONResponse
from typing import Union

app = FastAPI()

JWT_SECRET = get_env_variable("JWT_SECRET")
ALGORITHM = "HS256"


class RequestUser(BaseModel):
    email: EmailStr
    username: str
    id: str
    
    class Config:
        from_attributes = True

class JWTUser(BaseUser):
    def __init__(self, user_data: RequestUser):
        self.user_data = user_data
    
    @property
    def is_authenticated(self) -> bool:
        return True
    
    @property
    def display_name(self) -> str:
        return self.user_data.username
    
    @property
    def identity(self) -> str:
        return self.user_data.id
    
    # Direct access to Pydantic model
    @property
    def email(self) -> str:
        return self.user_data.email

class JWTToken(BaseModel):
    id: str
    exp: int
    
    class Config:
        from_attributes = True

def decode_token(token: str) -> JWTToken:
    decoded_token = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    try:
        validated_token = JWTToken.model_validate(decoded_token)
        return validated_token
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=440, detail="Token expired")
    except ValidationError:
        raise HTTPException(401, detail="Token malformed")


class JWTAuthBackend(AuthenticationBackend):
    async def authenticate(self, conn):
       # Extract the Authorization header
        auth_header = conn.headers.get("Authorization")
        
        if not auth_header:
            raise AuthenticationError("Authorization header is missing")
        
        # Validate the token (dummy validation for example)
        [signature, token] = auth_header.split(" ")
        if signature != "Bearer":
            raise AuthenticationError("Authorization header is malformed. It should have a structure `Bearer <token>`")
        
        decoded_token = decode_token(token)
        
        with Session(engine) as session:
            db_user = session.query(User).where(User.id == decoded_token.id).first()

            if db_user is None:
                raise AuthenticationError("No user found with this token")

            # Return AuthCredentials and user
            # You can customize scopes based on payload
            scopes = ["authenticated"]

            if db_user.id == '0078e384708140fdba9ac83a7507dc83':
                scopes.append("admin")
            
            return AuthCredentials(scopes), JWTUser(user_data=RequestUser.model_validate(db_user))

# Custom error handler for authentication errors
def on_auth_error(conn, exc: Exception):
    return JSONResponse(
        status_code=401,
        content={"error": str(exc)}
    )


# Custom Request class with typed user
class AuthRequest(StarletteRequest):
    @property
    def user(self) -> Union[JWTUser, BaseUser]:
        return super().user