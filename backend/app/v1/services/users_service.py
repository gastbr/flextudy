from typing import List, Optional
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from app.v1.models.user import User, CreateUser, UpdateUser, ReadUser
import app.v1.repositories.users_repository as repo
from app.v1.repositories.user_type_repository import get_user_type_by_name
from app.v1.services.auth.auth_service import pwd_context
import secrets
import string

async def get_users(session: AsyncSession) -> List[ReadUser]:
    return await repo.get_all_users(session)

async def get_user(session: AsyncSession, user_id: int) -> Optional[ReadUser]:
    return await repo.get_user_by_id(session, user_id)

async def create_user(session: AsyncSession, user_in: CreateUser) -> User:

    # Generate a random password
    if not user_in.password:
        user_in.password = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(12))

    hashed_password = pwd_context.hash(user_in.password)
    user_dict = user_in.dict()
    user = User(**user_dict)
    user.hashed_password = hashed_password

    # Generate a random profile_pic
    if not user_in.profile_pic:
        name_parts = user_in.name.split()
        names = '+'.join(name_parts[:2]) if len(name_parts) >= 2 else name_parts[0]
        user_in.profile_pic = f"https://avatar.iran.liara.run/username?username={names}"
   
    user.profile_pic = user_in.profile_pic

    # Query the UserType table to get the ID for the given user_type_name
    user_type = await get_user_type_by_name(session, user_in.user_type_name)

    if not user_type:
        raise ValueError(f"UserType '{user_in.user_type_name}' not found")

    user.user_type_id = user_type.id

    # Set status based on user_type_name
    if user_in.user_type_name == "student":
        user.status = "active"
    else:
        user.status = "pending"

    return await repo.create_user(session, user)

async def update_user(session: AsyncSession, user_id: int, user_in: UpdateUser) -> Optional[User]:
    return await repo.update_user(session, user_id, user_in)

async def delete_user(session: AsyncSession, user_id: int) -> bool:
    return await repo.delete_user(session, user_id)