from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.orm import selectinload
from app.v1.models.user import User

async def get_user_by_username(session: AsyncSession, username: str) -> User | None:
    """
    Retrieve a full User object by username for authentication purposes.
    """
    statement = select(User).where(User.username == username).options(selectinload(User.user_type))
    result = await session.execute(statement)
    return result.scalars().first()