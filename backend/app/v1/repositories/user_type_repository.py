from typing import Optional
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from app.v1.models.user_type import UserType

async def get_user_type_id_by_name(session: AsyncSession, user_type_name: str) -> Optional[int]:
    statement = select(UserType).where(UserType.name == user_type_name)
    result = await session.exec(statement)
    user_type = result.first()
    return user_type.id

async def get_user_type_name_by_id(session: AsyncSession, user_type_id: int) -> str:
    statement = select(UserType).where(UserType.id == user_type_id)
    result = await session.exec(statement)
    user_type = result.first()
    return user_type.name