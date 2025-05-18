# services/example_service.py
from typing import List
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.exc import IntegrityError
from app.v1.models.user import User
from app.v1.models.lesson import Lesson
from app.v1.models.attend import Attend, CreateAttend, ReadAttend
import app.v1.repositories.attend_repository as repo

async def get_attends_by_id_lesson(session: AsyncSession, lesson_id: int, user):
    results = await session.execute(
        select(Attend, User)
        .join(User, Attend.student_id == User.id)
        .where(Attend.lesson_id == lesson_id)
    )
    attends = results.all()

    formatted_results = []
    for attend, user in attends:
        formatted_results.append({
            "user_id": user.id,
            "student_name": user.name,
            "student username": user.username,
            "assistance": attend.assistance, 
            "lesson_id": attend.lesson_id,
        })

    return {"attends": formatted_results}

async def update_class_attends(session: AsyncSession, lesson_id: int, attends_in: List[Attend], user):
    results = []
    
    for attend in attends_in:
        # Buscar el registro existente
        db_attend = (await session.execute(
            select(Attend).where(
                Attend.lesson_id == lesson_id,
                Attend.student_id == attend.student_id
            )
        )).scalar_one_or_none()
        
        if db_attend:
            # Actualizar solo los campos que vienen en attends_in
            for field, value in attend.dict(exclude_unset=True).items():
                setattr(db_attend, field, value)
            session.add(db_attend)
        # else:
        #     # Si no existe, crear nuevo registro
        #     new_attend = Attend(lesson_id=lesson_id, **attend.dict(exclude_unset=True))
        #     session.add(new_attend)
        #     results.append(new_attend)
    
    try:
        await session.commit()
        # Refrescar todos los objetos actualizados
        for attend in results:
            await session.refresh(attend)
    except Exception as e:
        await session.rollback()
        raise e
    
    return {"attends": results}

async def create_class_attends(session: AsyncSession, lesson: int, user: User)->Attend:
    # Check if the lesson exists
    lesson = await session.execute(
        select(Lesson).where(Lesson.id == lesson)
    )
    lesson = lesson.scalar_one_or_none()
    if not lesson:
        raise ValueError(f"Lesson with id={lesson} does not exist.")

    # Create the attendance record
    attend = Attend(
        lesson_id=lesson.id,
        student_id=user.id,
        assistance=False
    )
    try:
        attends = await repo.create_attend(session, attend)
        return attends
    except IntegrityError as e:
        # Handle duplicate key violation
        if "duplicate key value violates unique constraint" in str(e.orig):
            raise ValueError(f"Student_id={user.id} already enrolled in lesson_id={lesson}.")
        else:
            raise e

async def delete_attendance(session: AsyncSession, lesson_id: int, user) -> ReadAttend:

    # Fetch attendance records for the given lesson and user
    return_attends = await repo.get_attend(session, lesson_id, user.id)
    
    if not return_attends:
        raise ValueError(f"User with id={user.id} is not enrolled in lesson with id={lesson_id}.")
    
    # Delete attendance records for the user in the specified lesson
    await repo.delete_attend(session, return_attends)
    
    return return_attends