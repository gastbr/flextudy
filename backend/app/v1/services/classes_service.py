# services/example_service.py
from typing import List, Optional
from sqlmodel import select, func
from sqlmodel.ext.asyncio.session import AsyncSession
from app.v1.models.lesson import Lesson, CreateLesson
from app.v1.models.user import User
from app.v1.models.attend import Attend
from app.v1.models.user_type import UserType
from app.v1.models.topic import Topic
from app.v1.models.subject import Subject
from app.v1.repositories.user_type_repository import get_user_type_by_name
from datetime import datetime


import app.v1.repositories.example_repository as repo

async def create_class(session: AsyncSession, lesson_in: CreateLesson, user) -> Lesson:
    lesson = Lesson.from_orm(lesson_in)
    
    # Check if topic exists
    topic = (await session.exec(
        select(Topic).where(Topic.id == lesson.topic_id)
    )).first()
    
    if not topic:
        raise ValueError("Topic not found")
    
    # Create the lesson
    session.add(lesson)
    await session.commit()
    await session.refresh(lesson)
    return lesson

async def get_class(session: AsyncSession, class_id: int,  user: Optional[dict] = None) -> dict:
    


    result = (await session.execute(
        select(Topic, Lesson, Subject)
        .select_from(Topic)
        .join(Lesson, Topic.id == Lesson.topic_id)
        .join(Subject, Topic.subject_id == Subject.id)
        .where(Lesson.id == class_id)
    )).first()
    
    if result:
        
        topic, lesson, subject = result
        
        enrolled_count = (await session.execute(
        select(func.count())
        .select_from(Attend)
        .where(Attend.lesson_id == lesson.id)
        )).scalar() or 0
        
        # Convertir el string a datetime primero
        start_datetime = datetime.fromisoformat(lesson.start_time.replace('Z', '+00:00'))
        end_datetime = datetime.fromisoformat(lesson.end_time.replace('Z', '+00:00'))
        
        # Formatear la fecha
        start_date = start_datetime.strftime("%b %d, %Y")
        # Formatear la hora
        start_time = start_datetime.strftime("%H:%M")
        end_time = end_datetime.strftime("%H:%M")
        time_str = f"{start_time} - {end_time}"
        
        class_data = {
            "class": {
                "id": lesson.id,
                "title": topic.name,
                "subject": subject.name,
                "start_time": start_datetime.isoformat(),
                "end_time": end_datetime.isoformat(),
                "date": start_date,
                "time": time_str,
                "description": topic.description,
                "teacher": user.name,
                "topic_id": topic.id,
                "location": lesson.lesson_url,
                "enrolled": enrolled_count,
                "capacity": lesson.max_capacity,
                "status": "available" if lesson.max_capacity > enrolled_count else "full",
            }
        }

        if user:
            if(user.user_type_name == "teacher"):
                if(user.id == topic.teacher_id):
                    class_data["class"]["teacher_owns_lesson"] = True
                else:
                    class_data["class"]["teacher_owns_lesson"] = False
            if(user.user_type_name == "student"):
                attended = (await session.execute(
                    select(Attend)
                    .where(Attend.student_id == user.id)
                    .where(Attend.lesson_id == lesson.id)
                ))
                if attended:
                    class_data["class"]["student_enrolled"] = True
                else:
                    class_data["class"]["student_enrolled"] = False
        return class_data


async def get_topics_by_teacher_id(session: AsyncSession, user) -> dict:
    

    topics = (await session.exec(
        select(Topic).where(Topic.teacher_id == user.id)
    )).all()
    
    subjecs = (await session.exec(
        select(Subject)
    )).all()

    response_data = {
        "topics": [topic.dict() for topic in topics],
        "subjects": [subject.dict() for subject in subjecs],
    }

    return response_data



async def get_my_classes(session: AsyncSession, user):
    
    if(user.user_type_name == "teacher"):
        
        result = (await session.execute(
            select(Topic, Lesson, Subject)
            .select_from(Topic)
            .join(Lesson, Topic.id == Lesson.topic_id)
            .join(Subject, Topic.subject_id == Subject.id)
            .where(Topic.teacher_id == user.id)
        )).all()
        
        formatted_results = []
        
        for topic, lesson, subject in result:
            
            enrolled_count = (await session.execute(
            select(func.count())
            .select_from(Attend)
            .where(Attend.lesson_id == lesson.id)
            )).scalar() or 0
            
            # Convertir el string a datetime primero
            start_datetime = datetime.fromisoformat(lesson.start_time.replace('Z', '+00:00'))
            end_datetime = datetime.fromisoformat(lesson.end_time.replace('Z', '+00:00'))
            
            # Formatear la fecha
            start_date = start_datetime.strftime("%b %d, %Y")
            # Formatear la hora
            start_time = start_datetime.strftime("%H:%M")
            end_time = end_datetime.strftime("%H:%M")
            time_str = f"{start_time} - {end_time}"
            
            formatted_results.append({
            "id": lesson.id,
            "title": topic.name,
            "subject": subject.name,
            "start_time": start_datetime.isoformat(),
            "end_time": end_datetime.isoformat(),
            "date": start_date,
            "time": time_str,
            "teacher": topic.name,
            "location": lesson.lesson_url,
            "enrolled": enrolled_count,  # Usamos el conteo que hicimos
            "capacity": lesson.max_capacity,
            "status": "available" if lesson.max_capacity > enrolled_count else "full",
            })
        
        return {"classes": formatted_results}
    
    if user.user_type_name == "student":
        
        results = (await session.execute(
        select(Attend, Lesson, Topic, Subject)
        .select_from(Attend)
        .join(Lesson, Attend.lesson_id == Lesson.id)
        .join(Topic, Lesson.topic_id == Topic.id)
        .join(Subject, Topic.subject_id == Subject.id)
        .where(Attend.student_id == user.id)
    )).all()

    formatted_results = []
    for attend, lesson, topic, subject in results:
        # Consulta para contar los estudiantes inscritos en esta lección
        enrolled_count = (await session.execute(
            select(func.count())
            .select_from(Attend)
            .where(Attend.lesson_id == lesson.id)
        )).scalar() or 0
        
        # Convertir el string a datetime primero
        start_datetime = datetime.fromisoformat(lesson.start_time)
        end_datetime = datetime.fromisoformat(lesson.end_time)
        
        # Formatear la fecha
        start_date = start_datetime.strftime("%b %d, %Y")
        # Formatear la hora
        start_time = start_datetime.strftime("%H:%M")
        end_time = end_datetime.strftime("%H:%M")
        time_str = f"{start_time} - {end_time}"
        
        formatted_results.append({
            "id": lesson.id,
            "title": topic.name,
            "subject": subject.name,
            "start_time": start_datetime.isoformat(),
            "end_time": end_datetime.isoformat(),
            "date": start_date,
            "time": time_str,
            "teacher": topic.name,
            "location": lesson.lesson_url,
            "enrolled": enrolled_count,  # Usamos el conteo que hicimos
            "capacity": lesson.max_capacity,
            "status": "available" if lesson.max_capacity > enrolled_count else "full",
        })

    return {"classes": formatted_results}

async def update_lesson(session: AsyncSession, class_id: int, class_in:Lesson, user):
        db_class = await session.get(Lesson, class_id)
        print(class_in)
        print("XXXXXXXXXXXXXXX")
        if not db_class:
            return None
        update_data = class_in.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_class, key, value)
        session.add(db_class)
        await session.commit()
        await session.refresh(db_class)
        return {
        "id": db_class.id,
        "max_capacity": db_class.max_capacity,
        "lesson_url": db_class.lesson_url,
        "topic_id": db_class.topic_id,
        "start_time": db_class.start_time,  # Convert datetime to string
        "end_time": db_class.end_time,
        }