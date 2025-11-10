from pydantic import BaseModel, Field, EmailStr
from typing import Annotated

class LoginUser(BaseModel):
    email: Annotated[EmailStr, Field()]
    password: Annotated[str, Field()]
    
class LoginUserResponse(BaseModel):
    email: EmailStr
    username: str
    id: str
    token: str
    
    class Config:
        from_attributes = True  #