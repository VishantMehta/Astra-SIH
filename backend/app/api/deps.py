from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlmodel import Session, select

from app.core.config import settings
from app.core.database import get_session
from app.models.user import User

# This tells FastAPI where to look for the token (in the "Authorization" header)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login/token")
def get_current_user(
    session: Annotated[Session, Depends(get_session)], 
    token: Annotated[str, Depends(oauth2_scheme)]
) -> User:
    """
    Decodes the JWT token to get the current user.
    This function is a dependency that can be used in any protected endpoint.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str | None = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = session.exec(select(User).where(User.username == username)).first()
    if user is None:
        raise credentials_exception
    return user