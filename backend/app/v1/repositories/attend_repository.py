# repositories/example_repository.py
from typing import List, Optional
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from app.v1.models.example import Example, CreateExample, UpdateExample

async def get_all_examples(session: AsyncSession) -> List[Example]:
    statement = select(Example)
    results = await session.exec(statement)
    return results.all()

async def get_example_by_id(session: AsyncSession, example_id: int) -> Optional[Example]:
    return await session.get(Example, example_id)

async def create_example(session: AsyncSession, example_in: CreateExample) -> Example:
    example = Example.from_orm(example_in)
    session.add(example)
    await session.commit()
    await session.refresh(example)
    return example

async def update_example(session: AsyncSession, example_id: int, example_in: UpdateExample) -> Optional[Example]:
    db_example = await session.get(Example, example_id)
    if not db_example:
        return None
    update_data = example_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_example, key, value)
    session.add(db_example)
    await session.commit()
    await session.refresh(db_example)
    return db_example

async def delete_example(session: AsyncSession, example_id: int) -> bool:
    db_example = await session.get(Example, example_id)
    if not db_example:
        return False
    await session.delete(db_example)
    await session.commit()
    return True
