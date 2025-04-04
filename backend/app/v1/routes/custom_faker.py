# routes/example_route.py
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlmodel.ext.asyncio.session import AsyncSession
from app.v1.repositories.fakers.seeders.db_seeder import db_seeder, db_seeder_deleter
from app.config.db import get_session

from typing import Annotated
from app.v1.models.user import User
from app.v1.services.auth.auth_service import authorize

router = APIRouter()

@router.get("/seed", response_model=List[dict])
async def read_examples(session: AsyncSession = Depends(get_session)):
    return await db_seeder(session)

@router.delete("/delete")
async def delete_db(
    session: AsyncSession = Depends(get_session)
    ):
    return await db_seeder_deleter(session)