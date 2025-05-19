# services/example_service.py
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import Optional
from app.v1.models.lesson import Lesson, CreateLesson
from app.v1.models.attend import Attend
from app.v1.models.topic import Topic
from app.v1.models.subject import Subject
from app.v1.models.user import User
from datetime import datetime
from sqlalchemy import func
from sqlalchemy.orm import selectinload
 
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
 
async def get_class(session: AsyncSession, query_params: Optional[dict] = None) -> dict:
    stmt = (
        select(Topic, Lesson, Subject, User)
        .select_from(Topic)
        .join(User, Topic.teacher_id == User.id)
        .join(Lesson, Topic.id == Lesson.topic_id)
        .join(Subject, Topic.subject_id == Subject.id)
    )

    # Filtering by class_id
    class_id = None
    if query_params and "id" in query_params:
        class_id = int(query_params["id"])
        stmt = stmt.where(Lesson.id == class_id)

    # Filtering by username (teacher or student)
    filter_user = None
    if query_params and "username" in query_params:
        username = query_params["username"]
        filter_user = (
            (await session.execute(
                select(User).options(selectinload(User.user_type)).where(User.username == username)
            )).scalar_one_or_none()
        )
        if filter_user:
            # Check if user is a teacher
            if hasattr(filter_user, "user_type_name") and filter_user.user_type_name == "teacher":
                stmt = stmt.where(User.username == username)
            else:
                # If not a teacher, check if student and filter lessons where student is enrolled
                subquery = (
                    select(Attend.lesson_id)
                    .where(Attend.student_id == filter_user.id)
                )
                stmt = stmt.where(Lesson.id.in_(subquery))

    # Filtering by subject name
    if query_params and "subject" in query_params:
        subject_name = query_params["subject"]
        stmt = stmt.where(Subject.name == subject_name)

    # Filtering by date (ISO format: YYYY-MM-DD)
    if query_params and "date" in query_params:
        date_str = query_params["date"]
        try:
            date_obj = datetime.fromisoformat(date_str)
            stmt = stmt.where(
                func.date(Lesson.start_time) == date_obj.date()
            )
        except Exception:
            pass  # Ignore invalid date format

    result = (await session.execute(stmt)).all()

    if result:
        classes = []
        for topic, lesson, subject, user in result:
            enrolled_count = (await session.execute(
                select(func.count())
                .select_from(Attend)
                .where(Attend.lesson_id == lesson.id)
            )).scalar() or 0

            start_datetime = datetime.fromisoformat(lesson.start_time.replace('Z', '+00:00'))
            end_datetime = datetime.fromisoformat(lesson.end_time.replace('Z', '+00:00'))
            start_date = start_datetime.strftime("%b %d, %Y")
            start_time = start_datetime.strftime("%H:%M")
            end_time_str = end_datetime.strftime("%H:%M")
            time_str = f"{start_time} - {end_time_str}"

            class_data = {
                "id": lesson.id,
                "title": topic.name,
                "subject": subject.name,
                "start_time": start_datetime.isoformat(),
                "end_time": end_datetime.isoformat(),
                "date": start_date,
                "time": time_str,
                "description": topic.description,
                "teacher_name": user.name,
                "teacher_username": user.username,
                "teacher_avatar": user.profile_pic,
                "topic_id": topic.id,
                "location": lesson.lesson_url,
                "enrolled": enrolled_count,
                "capacity": lesson.max_capacity,
                "status": "available" if lesson.max_capacity > enrolled_count else "full",
            }

            # Add user-specific info if username filter was used
            if filter_user:
                if hasattr(filter_user, "user_type_name") and filter_user.user_type_name == "teacher":
                    class_data["teacher_owns_lesson"] = (filter_user.id == topic.teacher_id)
                elif hasattr(filter_user, "user_type_name") and filter_user.user_type_name == "student":
                    attended = (await session.execute(
                        select(Attend)
                        .where(Attend.student_id == filter_user.id, Attend.lesson_id == lesson.id)
                    )).first()
                    class_data["student_enrolled"] = bool(attended)

            classes.append(class_data)

        return {"classes": classes}

    return None
 
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
            select(Topic, Lesson, Subject, User)
            .select_from(Topic)
            .join(Lesson, Topic.id == Lesson.topic_id)
            .join(User, Topic.teacher_id == User.id)
            .join(Subject, Topic.subject_id == Subject.id)
            .where(Topic.teacher_id == user.id)
        )).all()
       
        formatted_results = []
       
        for topic, lesson, subject , user in result:
           
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
            "teacher_name": user.name,
            "teacher_username": user.username,
            "teacher_avatar": user.profile_pic,
            "location": lesson.lesson_url,
            "enrolled": enrolled_count,  # Usamos el conteo que hicimos
            "capacity": lesson.max_capacity,
            "status": "available" if lesson.max_capacity > enrolled_count else "full",
            })
       
        return {"classes": formatted_results}
   
    if user.user_type_name == "student":
       
        results = (await session.execute(
        select(Attend, Lesson, Topic, Subject, User)
        .select_from(Attend)
        .join(Lesson, Attend.lesson_id == Lesson.id)
        .join(Topic, Lesson.topic_id == Topic.id)
        .join(User, Topic.teacher_id == User.id)
        .join(Subject, Topic.subject_id == Subject.id)
        .where(Attend.student_id == user.id)
    )).all()
 
    formatted_results = []
    for attend, lesson, topic, subject ,user in results:
        # Consulta para contar los estudiantes inscritos en esta lección
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
            "teacher_name": user.name,
            "teacher_username": user.username,
            "teacher_avatar": user.profile_pic,
            "location": lesson.lesson_url,
            "enrolled": enrolled_count,  # Usamos el conteo que hicimos
            "capacity": lesson.max_capacity,
            "status": "available" if lesson.max_capacity > enrolled_count else "full",
        })
 
    return {"classes": formatted_results}
 
async def update_lesson(session: AsyncSession, class_id: int, class_in:Lesson, user):
        db_class = await session.get(Lesson, class_id)
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