# services/example_service.py
from typing import List, Optional
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from app.v1.models.lesson import Lesson
from app.v1.models.topic import Topic
import app.v1.repositories.example_repository as repo

async def get_examples(session: AsyncSession) -> List[dict]:
    # Selecciona tanto Lesson como Topic
    statement = select(Lesson, Topic).join(Topic).where(Lesson.topic_id == Topic.id)
    results = await session.exec(statement)
    # Combina los datos de Lesson y Topic en un solo diccionario
    return [
        {
            "lesson": {
                "id": lesson.id,
                "max_capacity": lesson.max_capacity,
                "start_time": lesson.start_time,
                "end_time": lesson.end_time,
                "lesson_url": lesson.lesson_url,
                "topic_id": lesson.topic_id,
            },
            "topic": {
                "id": topic.id,
                "name": topic.name,
                "description": topic.description,
                "subject_id": topic.subject_id,
                "teacher_id": topic.teacher_id,
            },
        }
        for lesson, topic in results.all()
    ]


# async def get_example(session: AsyncSession, example_id: int) -> Optional[Example]:
#     return await repo.get_example_by_id(session, example_id)

# async def create_example(session: AsyncSession, example_in: CreateExample) -> Example:
#     return await repo.create_example(session, example_in)

# async def update_example(session: AsyncSession, example_id: int, example_in: UpdateExample) -> Optional[Example]:
#     return await repo.update_example(session, example_id, example_in)

# async def delete_example(session: AsyncSession, example_id: int) -> bool:
#     return await repo.delete_example(session, example_id)
