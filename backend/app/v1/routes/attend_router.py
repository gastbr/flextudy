# routes/example_route.py
from fastapi import APIRouter, Depends,HTTPException
from app.v1.models.attend import Attend, CreateAttend
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List, Dict, Any, Annotated
from app.v1.services.auth.auth_service import authorize
from app.v1.services.attend_service import (
    get_attends_by_id,
)
from app.config.db import get_session

router = APIRouter()


@router.get("/{lesson_id}", response_model=dict)
async def show_students_attends_by_lesson_id(
    user: Annotated[None, Depends(authorize)],
    lesson_id: int,
    session: AsyncSession = Depends(get_session)):
    attends =  await get_attends_by_id(session, lesson_id, user)
    if not attends:
        raise HTTPException(status_code=404, detail="Class not found")
    return attends


