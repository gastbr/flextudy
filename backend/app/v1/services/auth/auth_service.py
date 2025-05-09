import jwt
from jwt.exceptions import InvalidTokenError
from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from dotenv import load_dotenv
import os

from app.config.db import get_session
from app.v1.models.user import User, TokenData

load_dotenv()

API_URL = os.getenv("API_URL")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 15))

TOKENURL = f"{API_URL}/auth/login"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=TOKENURL, scheme_name="Bearer")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

async def get_user(db: AsyncSession, username: str) -> User | None:
    statement = select(User).where(User.username == username).options(selectinload(User.user_type))
    result = await db.execute(statement)
    user = result.scalar_one_or_none()

    # if user and user.user_type.id:
    #     await db.refresh(user, attribute_names=["user_type"])

    return user

async def authorize(
        token: Annotated[str, Depends(oauth2_scheme)],
        db: Annotated[AsyncSession, Depends(get_session)]
        ):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception
    user = await get_user(db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user