# routes/example_route.py
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from sqlalchemy.ext.asyncio import AsyncSession
from app.v1.models.user import User
from app.v1.services.auth.login_service import (
    login_for_access_token
)
from app.v1.services.auth.auth_service import get_current_user
from app.config.db import get_session

router = APIRouter()

@router.post("/token")
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Annotated[AsyncSession, Depends(get_session)]
    ):
    return await login_for_access_token(form_data, db)

@router.get("/users/me", response_model=User)
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_user)]
):
    return current_user

""" @router.get("/users/me/items")
async def read_own_items(
    current_user: Annotated[User, Depends(get_current_user)]
):
    return [{"item_id": "Foo", "owner": current_user.username}] """