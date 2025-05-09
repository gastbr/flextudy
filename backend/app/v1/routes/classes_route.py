# routes/example_route.py
from fastapi import APIRouter, Depends, Request, Body 
from typing import List, Dict, Any
from sqlmodel.ext.asyncio.session import AsyncSession
from app.v1.services.classes_service import (
    post_class,
)
from app.config.db import get_session

router = APIRouter()

# @router.post("/create", response_model=List[dict])
# async def create_new_lesson(
#     print(response_model)
# ):
    
#     # Puedes usar los datos en tu función get_lessons si es necesario
#     return "await get_lessons(session, request_data)"  # Asumiendo que modificas get_lesson

# @router.post("/examples", response_model=Example, status_code=201)
# async def create_new_example(example_in: CreateExample, session: AsyncSession = Depends(get_session)):
#     return await create_example(session, example_in)
