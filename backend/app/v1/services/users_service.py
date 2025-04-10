from typing import List, Optional
from sqlmodel.ext.asyncio.session import AsyncSession
from app.v1.models.user import User, CreateUser, UpdateUser, ReadUser
import app.v1.repositories.users_repository as repo
from app.v1.services.auth.auth_service import pwd_context

async def get_users(session: AsyncSession) -> List[ReadUser]:
    return await repo.get_all_users(session)

async def get_user(session: AsyncSession, user_id: int) -> Optional[ReadUser]:
    return await repo.get_user_by_id(session, user_id)

async def create_user(session: AsyncSession, user_in: CreateUser) -> User:
    hashed_password = pwd_context.hash(user_in.password)
    user_dict = user_in.dict()
    user = User(**user_dict)
    user.hashed_password = hashed_password
    return await repo.create_user(session, user)

async def update_user(session: AsyncSession, user_id: int, user_in: UpdateUser) -> Optional[User]:
    return await repo.update_user(session, user_id, user_in)

async def delete_user(session: AsyncSession, user_id: int) -> bool:
    return await repo.delete_user(session, user_id)