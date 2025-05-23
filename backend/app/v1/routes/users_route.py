from fastapi import APIRouter, Depends, HTTPException, Request
from typing import Annotated
from sqlmodel.ext.asyncio.session import AsyncSession
from app.v1.models.user import User, CreateUser, UpdateUser, ReadUserList
from app.v1.services.auth.auth_service import authorize, authorize_roles
from app.v1.services.users_service import (
    get_users,
    create_user,
    update_user,
    #delete_user
)
from app.config.db import get_session

router = APIRouter()


@router.get("", response_model=ReadUserList)
async def read_users(
    auth_user: Annotated[None, Depends(authorize)],
    request: Request = None,
    session: AsyncSession = Depends(get_session),
):
    query_params = dict(request.query_params)
    if "username" not in query_params:
        authorize_roles(auth_user, ["admin"])
    user_data = await get_users(session, query_params)
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    return user_data

@router.post("", response_model=User, status_code=201)
async def create_new_user(
    auth_user: Annotated[None, Depends(authorize)],
    user_in: CreateUser,
    session: AsyncSession = Depends(get_session),
):
    # authorize_roles(auth_user, ["admin"])
    return await create_user(session, user_in)


@router.put("/", response_model=User)
async def update_existing_user(
    auth_user: Annotated[None, Depends(authorize)],
    user_in: UpdateUser,
    session: AsyncSession = Depends(get_session),
):
    authorize_roles(auth_user, ["admin"])
    user = await update_user(session, user_in)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# @router.patch("/{user_id}", response_model=User)
# async def patch_existing_user(
#     auth_user: Annotated[None, Depends(authorize)],
#     user_id: int,
#     user_in: UpdateUser,
#     session: AsyncSession = Depends(get_session),
# ):
#     authorize_roles(auth_user, ["admin"])
#     user = await update_user(session, user_id, user_in)
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#     return user


# @router.delete("/{user_id}")
# async def delete_existing_user(
#     auth_user: Annotated[None, Depends(authorize)],
#     user_id: int,
#     session: AsyncSession = Depends(get_session),
# ):
#     authorize_roles(auth_user, ["admin"])
#     success = await delete_user(session, user_id)
#     if not success:
#         raise HTTPException(status_code=404, detail="User not found")
#     return {"message": "User deleted"}
