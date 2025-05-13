# services/example_service.py
from typing import List, Optional
from sqlmodel import select, func
from sqlmodel.ext.asyncio.session import AsyncSession
from app.v1.models.topic import Topic, CreateTopic, UpdateTopic
from app.v1.models.user import User
from app.v1.models.topic import Topic
from app.v1.models.subject import Subject


import app.v1.repositories.example_repository as repo

async def update_topic(session: AsyncSession, topic_id: int, topic_in: UpdateTopic) -> Optional[Topic]:
    db_example = await session.get(Topic, topic_id)
    if not db_example:
        return None
    update_data = topic_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_example, key, value)
    session.add(db_example)
    await session.commit()
    await session.refresh(db_example)
    return db_example

async def create_topic(session: AsyncSession, example_in: CreateTopic, user) -> Topic:
    topic = Topic.from_orm(example_in)
    topic.teacher_id = user.id
    session.add(topic)
    await session.commit()
    await session.refresh(topic)
    return topic