from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlmodel.ext.asyncio.session import AsyncSession
from app.v1.models.user import User, CreateUser, UpdateUser, ReadUser
from app.v1.services.users_service import (
    get_users,
    get_user,
    create_user,
    update_user,
    delete_user
)
from app.config.db import get_session

router = APIRouter()

@router.get("", response_model=List[ReadUser])
async def read_users(session: AsyncSession = Depends(get_session)):
    return await get_users(session)

@router.get("/{user_id}", response_model=ReadUser)
async def read_user(user_id: int, session: AsyncSession = Depends(get_session)):
    user = await get_user(session, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("", response_model=User, status_code=201)
async def create_new_user(user_in: CreateUser, session: AsyncSession = Depends(get_session)):
    return await create_user(session, user_in)

@router.put("/{user_id}", response_model=User)
async def update_existing_user(user_id: int, user_in: UpdateUser, session: AsyncSession = Depends(get_session)):
    user = await update_user(session, user_id, user_in)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.patch("/{user_id}", response_model=User)
async def patch_existing_user(user_id: int, user_in: UpdateUser, session: AsyncSession = Depends(get_session)):
    user = await update_user(session, user_id, user_in)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.delete("/{user_id}")
async def delete_existing_user(user_id: int, session: AsyncSession = Depends(get_session)):
    success = await delete_user(session, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"ok": True, "message": "User deleted"}