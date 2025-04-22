# services/example_service.py
from typing import List, Optional
from sqlmodel import select, func
from sqlmodel.ext.asyncio.session import AsyncSession
from app.v1.models.lesson import Lesson, CreateLesson
from app.v1.models.user import User
from app.v1.models.topic import Topic
from app.v1.models.subject import Subject


import app.v1.repositories.example_repository as repo

async def create_class(session: AsyncSession, lesson_in: CreateLesson) -> Lesson:
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

async def isUserRoll() -> bool:
    return True
    
async def get_topics_by_teacher_id(session: AsyncSession, user) -> dict:

    print("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    print("user", user)
    print("user", isUserRoll())


    topics = (await session.exec(
        select(Topic).where(Topic.teacher_id == user.id)
    )).all()
    
    subjecs = (await session.exec(
        select(Subject)
    )).all()

    response_data = {
        "topics": [topic.dict() for topic in topics],
        "subjects": [subject.dict() for subject in subjecs],
    }

    return response_data