from fastapi import APIRouter, UploadFile, Depends, File
from app.core.auth import get_current_user
from typing import Annotated

router = APIRouter(
    prefix="/mtts",
    tags=["mtts"]
)

@router.post("/split")
async def split_song(file: Annotated[UploadFile, File(description="A file read as UploadFile")], current_user = Depends(get_current_user)):
    print(file.filename)
    return