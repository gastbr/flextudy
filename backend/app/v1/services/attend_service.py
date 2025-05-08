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


import app.v1.repositories.example_repository as repo

async def get_attends_by_id(session: AsyncSession, lesson_id: int, user):

    # attends = (await session.exec(
    #     select(Attend, User)
    #     .join(User, Attend.student_id == User.id)
    #     .where(Attend.lesson_id == lesson_id)
    # )).all()

    # formatted_results = []
    # for user, attend in attends:
    #     formatted_results.append({
    #     "student_name": user.name,
    #     "assistance": attend.name,
    #     "lesson_id": attend.lesson_id,
    #     })
    
    # return {"attends": formatted_results}

    return {"attends": "attends_dicts"}

