from fastapi import Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Annotated

from app.v1.models.user import User, Token
from app.config.db import get_session
from app.v1.services.auth.auth_service import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, get_password_hash

async def register_user(db: AsyncSession, user: User) -> User:
    db.add(user)

def create_user() -> User:
    pass

def auth_register(
        form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
        db: Annotated[AsyncSession, Depends(get_session)]
) -> Token:
    pass
    