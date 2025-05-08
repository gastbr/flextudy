from typing import List, Optional
from sqlalchemy.orm import selectinload
from sqlalchemy import func
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from app.v1.models.user import User, CreateUser, UpdateUser, ReadUser
from math import ceil


async def get_all_users(session: AsyncSession, params) -> List[ReadUser]:
    statement = select(User).options(selectinload(User.user_type))
    
    # Filters
    if "role" in params:
        statement = statement.where(User.user_type.has(name=params["role"]))
    if "status" in params:
        statement = statement.where(User.status == params["status"])

    # Count
    count_stmt = select(func.count()).select_from(statement.subquery())
    total = await session.scalar(count_stmt)

    # Pagination
    limit = int(params.get("limit", total))
    offset = 0

    if "orderby" in params:
        order_by = params["orderby"]
        order_mapping = {
            "username": User.username,
            "email": User.email,
            "status": User.status,
            "name": User.name,
        }
        if order_by in order_mapping:
            column = order_mapping[order_by]
            if "desc" in params:
                statement = statement.order_by(column.desc())
            else:
                statement = statement.order_by(column)
        else:
            raise ValueError("Invalid orderby parameter")
    if "limit" in params:
        limit = int(params["limit"])
        statement = statement.limit(limit)
        if "page" in params:
            offset = (int(params["page"]) - 1) * limit
            statement = statement.offset(offset)
    if "offset" in params:
        offset = int(params["offset"])
        statement = statement.offset(offset)

    results = await session.exec(statement)
    users = results.all()
    total_pages = ceil(total / limit)
    return {
        "data": [ReadUser.from_orm(user) for user in users],
        "meta" : {
            "total": total,
            "per_page": limit,
            "current_page": (offset * limit) + 1,
            "total_pages": total_pages
        }
    }


async def get_user_by_id(session: AsyncSession, user_id: int) -> Optional[ReadUser]:
    statement = (
        select(User).where(User.id == user_id).options(selectinload(User.user_type))
    )
    results = await session.exec(statement)
    user = results.one_or_none()
    return ReadUser.from_orm(user) if user else None


async def get_user_by_username(session: AsyncSession, username: str) -> Optional[User]:
    statement = (
        select(User)
        .where(User.username == username)
        .options(selectinload(User.user_type))
    )
    result = await session.exec(statement)
    return result.one_or_none()


async def create_user(session: AsyncSession, user_in: CreateUser) -> User:
    session.add(user_in)
    await session.commit()
    await session.refresh(user_in)
    return user_in


async def update_user(
    session: AsyncSession,
    user_in: UpdateUser,
    user_id: int,
    user_type_id: Optional[int] = None,
) -> Optional[User]:
    db_user = await session.get(User, user_id)
    if not db_user:
        return None

    update_data = user_in.dict(exclude_unset=True)
    update_data.pop("user_type_name", None)

    for key, value in update_data.items():
        setattr(db_user, key, value)

    if user_type_id is not None:
        db_user.user_type_id = user_type_id

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
