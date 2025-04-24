# services/example_service.py
from typing import List, Optional
from sqlmodel import select, func
from sqlmodel.ext.asyncio.session import AsyncSession
from app.v1.models.lesson import Lesson, CreateLesson
from app.v1.models.user import User
from app.v1.models.user_type import UserType
from app.v1.models.topic import Topic
from app.v1.models.subject import Subject
from app.v1.services.auth.auth_service import isUserRoll


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



    
async def get_topics_by_teacher_id(session: AsyncSession, user) -> dict:
    

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



async def get_my_classes(session: AsyncSession, user):
    
    isTeacher = await isUserRoll("teacher", user, session)

    if isTeacher:
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
    else:
        response_data = {
            "Answer": "Unauthorized",
            "status": 401,
            "message": "You are not authorized to access this resource."
        }
    

    return response_data
