from pydantic import BaseModel, EmailStr
from ..db.models import USER_SCOPE
    
class RequestUser(BaseModel):
    email: EmailStr
    username: str
    id: str
    scopes: list[USER_SCOPE]
    
    class Config:
        from_attributes = True

class JWTToken(BaseModel):
    id: str
    exp: int
    scopes: list[str]
    
    class Config:
        from_attributes = True

class DataToEncode(BaseModel):
    sub: str

    class Config:
        from_attributes =  True
