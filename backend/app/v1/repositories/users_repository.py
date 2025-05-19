from fastapi import HTTPException
from typing import Optional
from sqlalchemy.orm import selectinload
from sqlalchemy import func
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from app.v1.models.user import User, CreateUser, UpdateUser, ReadUser, ReadUserList
from math import ceil

async def get_users(session: AsyncSession, params) -> ReadUserList:
    statement = select(User).options(selectinload(User.user_type))
    
    # Filters
    if "id" in params:
        user_id = int(params["id"])
        statement = statement.where(User.id == user_id)
    if "username" in params:
        statement = statement.where(User.username == params["username"])
        # statement = statement.where(User.username.ilike(f"%{params['username']}%"))
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
    if "username" in params and not users:
        raise HTTPException(status_code=404, detail=f"User with username '{params['username']}' not found.")

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

async def create_user(session: AsyncSession, user_in: CreateUser) -> User:
    session.add(user_in)
    await session.commit()
    await session.refresh(user_in)
    return user_in


async def update_user(
    session: AsyncSession,
    user_in: UpdateUser,
    user_type_id: Optional[int] = None,
) -> Optional[User]:
    statement = select(User).where(User.username == user_in.username)
    result = await session.exec(statement)
    db_user = result.first()
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
