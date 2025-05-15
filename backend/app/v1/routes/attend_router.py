# routes/example_route.py
from fastapi import APIRouter, Depends,HTTPException
from app.v1.models.attend import Attend, ReadAttend
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List, Annotated
from app.v1.services.auth.auth_service import authorize, authorize_roles
from app.v1.services.attend_service import (
    get_attends_by_id_lesson,
    update_class_attends,
    create_class_attends,
    delete_attendance
)
from app.config.db import get_session

router = APIRouter()

@router.get("/{lesson_id}", response_model=dict)
async def show_students_attends_by_lesson_id(
    user: Annotated[None, Depends(authorize)],
    lesson_id: int,
    session: AsyncSession = Depends(get_session)):
    attends =  await get_attends_by_id_lesson(session, lesson_id, user)
    if not attends:
        raise HTTPException(status_code=404, detail="Class not found")
    return attends

@router.post("/{lesson_id}", response_model=ReadAttend)
async def add_authenticated_student_enrollment(
    user: Annotated[None, Depends(authorize)],
    lesson_id: int,
    session: AsyncSession = Depends(get_session)):
    authorize_roles(user, ["student"])  
    attends =  await create_class_attends(session, lesson_id, user)
    if not attends:
        raise HTTPException(status_code=404, detail="Class not found")
    return attends 

@router.put("/class_attends/{lesson_id}", response_model=dict)
async def update_the_attends_of_a_lesson(
    user: Annotated[None, Depends(authorize)],
    lesson_id: int,
    attends_in: List[Attend],
    session: AsyncSession = Depends(get_session)):
    attends =  await update_class_attends(session, lesson_id, attends_in, user)
    if not attends:
        raise HTTPException(status_code=404, detail="Class not found")
    return attends

@router.delete("/{lesson_id}", response_model=ReadAttend)
async def delete_authenticated_student_enrollment_from_lesson(
    user: Annotated[None, Depends(authorize)],
    lesson_id: int,
    session: AsyncSession = Depends(get_session)):
    authorize_roles(user, ["student"])  
    attends =  await delete_attendance(session, lesson_id, user)
    if not attends:
        raise HTTPException(status_code=404, detail="Class not found")
    return attends