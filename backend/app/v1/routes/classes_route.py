# routes/example_route.py
from fastapi import APIRouter, Depends, Request, Body 
from app.v1.models.lesson import Lesson, CreateLesson
from typing import List, Dict, Any
from sqlmodel.ext.asyncio.session import AsyncSession
from app.v1.services.classes_service import (
    create_class,
    get_topics_by_teacher_id,
)
from app.config.db import get_session

router = APIRouter()

# @router.post("/create", response_model=List[dict])
# async def create_new_lesson(
#     print(response_model)
# ):
    
# #     # Puedes usar los datos en tu función get_lessons si es necesario
# #     return "await get_lessons(session, request_data)"  # Asumiendo que modificas get_lesson

@router.post("/create", response_model=Lesson, status_code=201)
async def create_new_example(example_in: CreateLesson, session: AsyncSession = Depends(get_session)):
    return await create_class(session, example_in)

@router.get("/to_create", response_model=dict)
async def get_info_to_create_lesson(session: AsyncSession = Depends(get_session)):
    return await get_topics_by_teacher_id(session)

