# services/example_service.py
from typing import List, Optional
from sqlmodel.ext.asyncio.session import AsyncSession
from app.v1.models.example import Example, CreateExample, UpdateExample
import app.v1.repositories.example_repository as repo

async def get_examples(session: AsyncSession) -> List[Example]:
    return await repo.get_all_examples(session)

async def get_example(session: AsyncSession, example_id: int) -> Optional[Example]:
    return await repo.get_example_by_id(session, example_id)

async def create_example(session: AsyncSession, example_in: CreateExample) -> Example:
    return await repo.create_example(session, example_in)

async def update_example(session: AsyncSession, example_id: int, example_in: UpdateExample) -> Optional[Example]:
    return await repo.update_example(session, example_id, example_in)

async def delete_example(session: AsyncSession, example_id: int) -> bool:
    return await repo.delete_example(session, example_id)
