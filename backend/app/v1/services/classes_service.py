# services/example_service.py
from typing import List, Optional
from sqlmodel import select, func
from sqlmodel.ext.asyncio.session import AsyncSession
from app.v1.models.lesson import Lesson
from app.v1.models.topic import Topic
from app.v1.models.user import User
from app.v1.models.attend import Attend

import app.v1.repositories.example_repository as repo

async def post_class(session: AsyncSession) -> List[dict]:
    
    
    
    return "ENDPOINT"
