# routes/example_route.py
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from sqlalchemy.ext.asyncio import AsyncSession
from app.v1.models.user import User, ReadUser, UpdateUser
from app.v1.services.auth.auth_service import authorize
from app.v1.services.auth.login_service import auth_login
from app.v1.services.users_service import update_user
from app.config.db import get_session

# # # # EJEMPLO BÁSICO DE RUTA PROTEGIDA # # # #

# _: Annotated[None, Depends(authorize)]
# Esta línea añade la dependencia authorize a un objeto vacío (_).

# @router.get("/hi")
# async def hi(_: Annotated[None, Depends(authorize)]):
#     return {"hi": "hi"}

router = APIRouter()

# # # # Login route # # # #

# The login route uses OAuth2PasswordRequestForm, which requires a specific request body format.
# To authenticate, provide a JSON body with the following parameters:
# - grant_type: "password" (required)
# - username: string (required)
# - password: string (required)
# - scope: string (optional, can be empty)
# - client_id: string (optional, required for client credentials flow)
#   - A unique identifier for the client application making the request.
#   - Used to authenticate the client, not the user.
# - client_secret: string (optional, required for client credentials flow)
#   - A secret key used to authenticate the client application.
#   - Should be kept confidential to prevent unauthorized access.
# Note: client_id and client_secret are only required for client credentials flow,
#       and can be ignored for password-based authentication.

@router.post("/login")
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Annotated[AsyncSession, Depends(get_session)]
    ):
    return await auth_login(form_data, db)

""" @router.post("/register", response_model=User)
async def register(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Annotated[AsyncSession, Depends(get_session)]
    ):
    return await auth_register(form_data, db) """

@router.get("/me", response_model=ReadUser)
async def read_user_me(
    auth_user: Annotated[ReadUser, Depends(authorize)]
):
    return auth_user

@router.put("/me", response_model=ReadUser)
async def update_user_me(
    auth_user: Annotated[ReadUser, Depends(authorize)],
    user_in: UpdateUser,
    session: AsyncSession = Depends(get_session)
):
    user = await update_user(session, auth_user.id, user_in)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
    
# @router.patch("/me", response_model=ReadUser)
# async def patch_user_me(
#     auth_user: Annotated[ReadUser, Depends(authorize)],
#     user_in: UpdateUser,
#     session: AsyncSession = Depends(get_session)
# ):
#     user = await update_user(session, auth_user.id, user_in)
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#     return user
    