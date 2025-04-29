from typing import Optional
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from app.v1.models.user_type import UserType

async def get_user_type_by_name(session: AsyncSession, user_type_name: str) -> Optional[UserType]:
    statement = select(UserType).where(UserType.name == user_type_name)
    result = await session.exec(statement)
    return result.first()