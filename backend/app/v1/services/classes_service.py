# services/example_service.py
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from app.v1.models.lesson import Lesson, CreateLesson
from app.v1.models.topic import Topic
from app.v1.repositories.user_type_repository import get_user_type_name_by_id
import app.v1.repositories.classes_repository as repo

async def create_class(session: AsyncSession, lesson_in: CreateLesson, user) -> Lesson:
    lesson = Lesson.from_orm(lesson_in)
    
    # Check if topic exists
    topic = (await session.exec(
        select(Topic).where(Topic.id == lesson.topic_id)
    )).first()
    
    if not topic:
        raise ValueError("Topic not found")
    
    # Create the lesson
    session.add(lesson)
    await session.commit()
    await session.refresh(lesson)
    return lesson

async def get_topics_by_teacher_id(session: AsyncSession, user) -> dict:
    role = await get_user_type_name_by_id(session, user.user_type_id)
    if role == 'teacher':
        topics = await repo.get_topics_by_teacher_id(session, user.id)
        subjects = await repo.get_all_subjects(session)

        response_data = {
            "topics": [topic.dict() for topic in topics],
            "subjects": [subject.dict() for subject in subjects],
        }
    else:
        response_data = {
            "Answer": "Unauthorized",
            "status": 401,
            "message": "You are not authorized to access this resource."
        }
    return response_data

async def get_my_classes(session: AsyncSession, user):
    role = await get_user_type_name_by_id(session, user.user_type_id)
    if role == 'teacher':
        topics = repo.get_topics_by_teacher_id(session, user.id)
        subjects = repo.get_all_subjects
        response_data = {
            "topics": [topic.dict() for topic in topics],
            "subjects": [subject.dict() for subject in subjects],
        }
    else:
        response_data = {
            "Answer": "Unauthorized",
            "status": 401,
            "message": "You are not authorized to access this resource."
        }
    return response_data
