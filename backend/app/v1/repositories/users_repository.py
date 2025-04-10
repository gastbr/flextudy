from typing import List, Optional
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from app.v1.models.user import User, CreateUser, UpdateUser

async def get_all_users(session: AsyncSession) -> List[User]:
    statement = select(User)
    results = await session.exec(statement)
    return results.all()

async def get_user_by_id(session: AsyncSession, user_id: int) -> Optional[User]:
    return await session.get(User, user_id)

async def create_user(session: AsyncSession, user_in: CreateUser) -> User:
    user = User.from_orm(user_in)
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user

async def update_user(session: AsyncSession, user_id: int, user_in: UpdateUser) -> Optional[User]:
    db_user = await session.get(User, user_id)
    if not db_user:
        return None
    update_data = user_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_user, key, value)
    session.add(db_user)
    await session.commit()
    await session.refresh(db_user)
    return db_user

async def delete_user(session: AsyncSession, user_id: int) -> bool:
    db_user = await session.get(User, user_id)
    if not db_user:
        return False
    await session.delete(db_user)
    await session.commit()
    return True
