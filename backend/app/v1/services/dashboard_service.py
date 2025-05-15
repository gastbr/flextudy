# services/example_service.py
from typing import List, Optional
from sqlmodel import select, func
from sqlmodel.ext.asyncio.session import AsyncSession
from app.v1.models.lesson import Lesson
from app.v1.models.topic import Topic
from app.v1.models.user import User
from app.v1.models.attend import Attend

import app.v1.repositories.example_repository as repo

async def get_lessons(session: AsyncSession, user) -> List[dict]:
    from sqlalchemy.orm import aliased
    from sqlalchemy import func, select as sql_select
    
    Student = aliased(User)
    
    # Subconsulta para contar estudiantes
    student_count = (
        sql_select(
            Attend.lesson_id,
            func.count(Attend.student_id).label("student_count")
        )
        .group_by(Attend.lesson_id)
        .subquery()
    )
    
    statement = (
        select(
            Lesson,
            Topic,
            User,
            student_count.c.student_count
        )
        .join(Topic, Lesson.topic_id == Topic.id)
        .join(User, Topic.teacher_id == User.id)
        .join(student_count, student_count.c.lesson_id == Lesson.id, isouter=True)
    )
    
    results = await session.exec(statement)
    
    lessons_dict = {}
    for lesson, topic, teacher, student_count in results:

        student_count = student_count or 0  # En caso de que sea None
        enrolled = (await session.exec(
            select(Attend)
            .where(Attend.lesson_id == lesson.id)
            .where(Attend.student_id == user.id)
        )).first()

        status = None
        if enrolled:
            status = "enrolled"
        else:
            if student_count >= lesson.max_capacity:
                status = "full"
            else:
                status = "available"

        lessons_dict[lesson.id] = {
            "id": lesson.id,
            "title": topic.name,
            "start_time": lesson.start_time,
            "end_time": lesson.end_time,
            "teacher": teacher.name,
            "status": status,
            "spots": f"{student_count}/{lesson.max_capacity}",
        }
    
    return list(lessons_dict.values())
