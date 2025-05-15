# routes/example_route.py
from fastapi import APIRouter, Depends
from typing import Annotated
from typing import List
from app.v1.services.auth.auth_service import authorize
from sqlmodel.ext.asyncio.session import AsyncSession
from app.v1.services.dashboard_service import (
    get_lessons,
)
from app.config.db import get_session

router = APIRouter()

@router.get("/lessons", response_model=List[dict])
async def read_examples(
    user: Annotated[None, Depends(authorize)],
    session: AsyncSession = Depends(get_session)):
    return await get_lessons(session, user)

# @router.post("", response_model=List[dict])
# async def create_new_example(example_in: CreateExample, session: AsyncSession = Depends(get_session)):
#     return await create_example(session, example_in)
