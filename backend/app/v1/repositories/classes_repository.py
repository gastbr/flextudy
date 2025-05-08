from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from app.v1.models.topic import Topic
from app.v1.models.subject import Subject

async def get_topics_by_teacher_id(session: AsyncSession, teacher_id: int):
    topics = (await session.exec(
        select(Topic).where(Topic.teacher_id == teacher_id)
    )).all()
    return topics

async def get_all_subjects(session: AsyncSession):
    subjects = (await session.exec(
        select(Subject)
    )).all()
    return subjects