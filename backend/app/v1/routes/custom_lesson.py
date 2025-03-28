# routes/example_route.py
from fastapi import APIRouter, Depends
from typing import List
from sqlmodel.ext.asyncio.session import AsyncSession
from app.v1.services.custom_lesson_service import (
    get_examples,
)
from app.config.db import get_session

router = APIRouter()

@router.get("", response_model=List[dict])
async def read_examples(session: AsyncSession = Depends(get_session)):
    return await get_examples(session)
