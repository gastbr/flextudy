# routes/example_route.py
from fastapi import APIRouter, Depends, Request, Body ,HTTPException
from app.v1.models.topic import Topic, UpdateTopic, CreateTopic
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List, Dict, Any, Annotated
from app.v1.services.auth.auth_service import authorize
from app.v1.services.topic_service import (
    update_topic,
    create_topic
)
from app.config.db import get_session

router = APIRouter()


@router.post("/create", response_model=Topic, status_code=201)
async def create_new_example(
    user: Annotated[None, Depends(authorize)],
    example_in: CreateTopic,
    session: AsyncSession = Depends(get_session)):
    return await create_topic(session, example_in, user)

@router.put("/edit/{topic_id}", response_model=Topic)
async def update_existing_example(
    user: Annotated[None, Depends(authorize)],
    topic_id: int, topic_in: UpdateTopic,
    session: AsyncSession = Depends(get_session)):

    topicUpdated = await update_topic(session, topic_id, topic_in)
    if not topicUpdated:
        raise HTTPException(status_code=404, detail="Topic not found")
    return topicUpdated


