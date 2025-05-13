# services/example_service.py
from typing import List, Optional
from sqlmodel import select, func
from sqlmodel.ext.asyncio.session import AsyncSession
from app.v1.models.lesson import Lesson, CreateLesson
from app.v1.models.user import User
from app.v1.models.attend import Attend
from app.v1.models.user_type import UserType
from app.v1.models.topic import Topic
from app.v1.models.subject import Subject
from datetime import datetime
# XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

import app.v1.repositories.example_repository as repo


# XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
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
# XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
