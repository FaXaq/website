from pydantic import BaseModel, Field, EmailStr
   
class LoginUserResponse(BaseModel):
    email: EmailStr
    access_token: str
    refresh_token: str
    scopes: list[str]
    
    class Config:
        from_attributes = True  #

class LoginUser(BaseModel):
    email: str
    password: str
