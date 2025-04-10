from typing import List, Optional
from sqlmodel.ext.asyncio.session import AsyncSession
from app.v1.models.user import User, CreateUser, UpdateUser
import app.v1.repositories.users_repository as repo

async def get_users(session: AsyncSession) -> List[User]:
    return await repo.get_all_users(session)

async def get_user(session: AsyncSession, user_id: int) -> Optional[User]:
    return await repo.get_user_by_id(session, user_id)

async def create_user(session: AsyncSession, user_in: CreateUser) -> User:
    return await repo.create_user(session, user_in)

async def update_user(session: AsyncSession, user_id: int, user_in: UpdateUser) -> Optional[User]:
    return await repo.update_user(session, user_id, user_in)

async def delete_user(session: AsyncSession, user_id: int) -> bool:
    return await repo.delete_user(session, user_id)