# routes/example_route.py
from fastapi import APIRouter, Depends, HTTPException, Request
from app.v1.models.lesson import Lesson, CreateLesson
from typing import Annotated
from app.v1.services.auth.auth_service import authorize, authorize_roles
from sqlmodel.ext.asyncio.session import AsyncSession
from app.v1.services.classes_service import (
    create_class,
    get_topics_by_teacher_id,
    get_my_classes,
    get_class,
    update_lesson
)
from app.config.db import get_session

router = APIRouter()

# @router.post("/create", response_model=List[dict])
# async def create_new_lesson(
#     print(response_model)
# ):
    
# #     # Puedes usar los datos en tu función get_lessons si es necesario
# #     return "await get_lessons(session, request_data)"  # Asumiendo que modificas get_lesson

@router.get("/to_create", response_model=dict)
async def get_info_to_create_lesson(
    user: Annotated[None, Depends(authorize)],
    session: AsyncSession = Depends(get_session)
    ):
    authorize_roles(user, ['admin', 'teacher'])
    return await get_topics_by_teacher_id(session, user)

@router.post("/create", response_model=Lesson, status_code=201)
async def create_new_example(
    user: Annotated[None, Depends(authorize)],
    lesson_in: CreateLesson,
    session: AsyncSession = Depends(get_session)
    ):
    return await create_class(session, lesson_in, user)

@router.put("/edit/{lesson_id}", response_model=dict)
async def update_existing_example(
    user: Annotated[None, Depends(authorize)],
    lesson_id: int,
    lesson_in: CreateLesson,
    session: AsyncSession = Depends(get_session)):
    example = await update_lesson(session, lesson_id, lesson_in, user)
    if not example:
        raise HTTPException(status_code=404, detail="Class not found")
    return example


@router.get("/my_classes", response_model=dict)
async def get_my_classes_view(
    user: Annotated[None, Depends(authorize)],
    session: AsyncSession = Depends(get_session)
    ):
    authorize_roles(user, ['teacher', 'student'])
    return await get_my_classes(session, user)


@router.get("", response_model=dict)
async def get_classes_by_query_params(
    _: Annotated[None, Depends(authorize)],
    request: Request,
    session: AsyncSession = Depends(get_session),
    ):
    query_params = dict(request.query_params)
    example = await get_class(session, query_params)
    if not example:
        raise HTTPException(status_code=404, detail="Class not found")
    return example

