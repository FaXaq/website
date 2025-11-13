from pydantic import BaseModel, Field, field_validator, EmailStr
from typing import Annotated

class CreateUserRequest(BaseModel):
    username: Annotated[str, Field(min_length=4, max_length=25)]
    email: Annotated[EmailStr, Field(),]
    password: Annotated[str, Field(min_length=8)]

    @field_validator("password")
    @classmethod
    def no_whitespace(cls, password: str) -> str:
        errors: list[str] = []
        if ' ' in password:
            errors.append('not contain spaces')
        if not any(char in '!@#$%^&*()_+-=[]{}|;:,.<>?/' for char in password):
            errors.append('have at least one special character')
        if not any(char.islower() for char in password):
            errors.append('have at least one lowercase letter')
        if not any(char.isdigit() for char in password):
            errors.append('have at least one digit')
        if not any(char.isupper() for char in password):
            errors.append('have at least one uppercase letter')
        if len(errors) > 0:
            raise ValueError('password must ' + ', '.join(errors) + '.')
        return password
    
class CreateUserResponse(BaseModel):
    username: str
    email: EmailStr
    id: str
    
    class Config:
        from_attributes = True  #

class ListUsersResponse(BaseModel):
    username: str
    email: EmailStr
    id: str

    class Config:
        from_attributes = True