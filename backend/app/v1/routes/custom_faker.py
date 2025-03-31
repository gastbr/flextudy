# routes/example_route.py
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlmodel.ext.asyncio.session import AsyncSession
from app.v1.repositories.fakers.seeders.db_seeder import (
    db_seeder,
    db_seeder_deleter
)
from app.config.db import get_session

router = APIRouter()

@router.post("/seed", response_model=List[dict])
async def read_examples(session: AsyncSession = Depends(get_session)):
    return await db_seeder(session)

# @router.get("/examples/{example_id}", response_model=Example)
# async def read_example(example_id: int, session: AsyncSession = Depends(get_session)):
#     example = await get_example(session, example_id)
#     if not example:
#         raise HTTPException(status_code=404, detail="Example not found")
#     return example

# @router.post("/examples", response_model=Example, status_code=201)
# async def create_new_example(example_in: CreateExample, session: AsyncSession = Depends(get_session)):
#     return await create_example(session, example_in)

# @router.put("/examples/{example_id}", response_model=Example)
# async def update_existing_example(example_id: int, example_in: UpdateExample, session: AsyncSession = Depends(get_session)):
#     example = await update_example(session, example_id, example_in)
#     if not example:
#         raise HTTPException(status_code=404, detail="Example not found")
#     return example

@router.delete("/delete")
async def delete_db(session: AsyncSession = Depends(get_session)):
    return await db_seeder_deleter(session)