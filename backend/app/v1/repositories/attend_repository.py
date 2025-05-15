from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from app.v1.models.attend import Attend

async def get_attend(session: AsyncSession, lesson_id: int, user_id: int) -> Attend:
    result = await session.execute(
        select(Attend)
        .where(
            Attend.lesson_id == lesson_id,
            Attend.student_id == user_id
            ))
    attend_out = result.scalar_one_or_none()
    return attend_out

async def create_attend(session: AsyncSession, attend_in: Attend) -> Attend:
    session.add(attend_in)
    await session.commit()
    await session.refresh(attend_in)
    return attend_in

async def delete_attend(session: AsyncSession, attend_in: Attend) -> bool:
    await session.delete(attend_in)
    await session.commit()
    return True