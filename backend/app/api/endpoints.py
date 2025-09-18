from fastapi import APIRouter
from app.models.user import User 

router = APIRouter()

@router.get("/")
def read_root():
    """
    This is the root endpoint for our API.
    It returns a welcome message.
    """
    return {"message": "Welcome to the Astra API!"}