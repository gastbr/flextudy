# services/example_service.py
from typing import List, Optional
from sqlmodel import select, func
from sqlmodel.ext.asyncio.session import AsyncSession
from app.v1.models.lesson import Lesson
from app.v1.models.topic import Topic
from app.v1.models.user import User
from app.v1.models.attend import Attend

import app.v1.repositories.example_repository as repo

async def get_examples(session: AsyncSession) -> List[dict]:
    # Necesitamos aliases para distinguir entre profesor y estudiante
    from sqlalchemy.orm import aliased
    Student = aliased(User)
    
    statement = (
        select(
            Lesson,
            Topic,
            User,  # Profesor
            Attend,
            Student  # Estudiante
        )
        .join(Topic, Lesson.topic_id == Topic.id)
        .join(User, Topic.teacher_id == User.id)
        .join(Attend, Attend.lesson_id == Lesson.id, isouter=True)
        .join(Student, Attend.student_id == Student.id, isouter=True)
    )
    
    results = await session.exec(statement)
    
    lessons_dict = {}
    for lesson, topic, teacher, attend, student in results:
        if lesson.id not in lessons_dict:
            lessons_dict[lesson.id] = {
                "lesson": dict(lesson),
                "topic": dict(topic),
                "teacher": dict(teacher),
                "students": []
            }
        if attend and student:
            lessons_dict[lesson.id]["students"].append({
                "student_info": dict(student),
                "assistance": attend.assistance
            })
    
    return list(lessons_dict.values())

# async def get_example(session: AsyncSession, example_id: int) -> Optional[Example]:
#     return await repo.get_example_by_id(session, example_id)

# async def create_example(session: AsyncSession, example_in: CreateExample) -> Example:
#     return await repo.create_example(session, example_in)

# async def update_example(session: AsyncSession, example_id: int, example_in: UpdateExample) -> Optional[Example]:
#     return await repo.update_example(session, example_id, example_in)

# async def delete_example(session: AsyncSession, example_id: int) -> bool:
#     return await repo.delete_example(session, example_id)
