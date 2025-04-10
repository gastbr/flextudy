from typing import List, Optional
from sqlalchemy.orm import selectinload
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from app.v1.models.user import User, CreateUser, UpdateUser, ReadUser

async def get_all_users(session: AsyncSession) -> List[ReadUser]:
    statement = select(User).options(selectinload(User.user_type))
    results = await session.exec(statement)
    users = results.all()
    return [ReadUser.from_orm(user) for user in users]

async def get_user_by_id(session: AsyncSession, user_id: int) -> Optional[ReadUser]:
    statement = select(User).where(User.id == user_id).options(selectinload(User.user_type))
    results = await session.exec(statement)
    user = results.one_or_none()
    return ReadUser.from_orm(user) if user else None

async def create_user(session: AsyncSession, user_in: User) -> User:
    session.add(user_in)
    await session.commit()
    await session.refresh(user_in)
    return user_in

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
