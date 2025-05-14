from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.orm import selectinload
from app.v1.models.user import User
from app.v1.models.user_type import UserType
from app.v1.models.session import Session

async def get_user_by_username(session: AsyncSession, username: str) -> User | None:
    """
    Retrieve a full User object by username for authentication purposes.
    """
    statement = select(User).where(User.username == username).options(selectinload(User.user_type))
    result = await session.execute(statement)
    return result.scalars().first()

async def create_token_session(session: AsyncSession, token: str, user_id: int) -> None:
    """
    Create a new token for a user.
    """
    new_session = Session(user_id=user_id, token=token)
    session.add(new_session)
    await session.commit()
    await session.refresh(new_session)
    return new_session

async def get_user_by_token(session: AsyncSession, token: str) -> User | None:
    """
    Retrieve a user by their token.
    """
    statement = select(User, UserType).join(UserType).join(Session).where(Session.token == token)
    result = (await session.execute(statement)).first()
    if not result:
        return None
    response = {
        "id": result[0].id,
        "username": result[0].username,
        "name": result[0].name,
        "email": result[0].email,
        "user_type_name": result[1].name
    } 
    return response