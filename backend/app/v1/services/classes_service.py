# services/example_service.py
from typing import List, Optional
from sqlmodel import select, func
from sqlmodel.ext.asyncio.session import AsyncSession
from app.v1.models.lesson import Lesson, CreateLesson
import app.v1.repositories.example_repository as repo

async def create_class(session: AsyncSession, lesson_in: CreateLesson) -> Lesson:
    lesson = Lesson.from_orm(lesson_in)
    session.add(lesson)
    await session.commit()
    await session.refresh(lesson)
    return lesson
    
