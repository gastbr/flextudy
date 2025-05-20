from sqlmodel import select, delete
from app.v1.repositories.fakers.seeders.usertype_seeder import usertype_seeder
from app.v1.models.user_type import UserType
from app.v1.models.user import User
from app.v1.repositories.fakers.factories.user_factory import UserFactory
from app.v1.repositories.fakers.factories.topic_factory import TopicFactory
from app.v1.repositories.fakers.factories.lessonFactory import LessonFactory
from app.v1.repositories.fakers.factories.attendFactory import AttendFactory
from app.v1.models.subject import Subject
from app.v1.models.topic import Topic
from app.v1.models.lesson import Lesson
from app.v1.services.auth.auth_service import get_password_hash
from app.v1.models.attend import Attend
from datetime import datetime, timedelta, timezone
import random

from sqlalchemy.sql.expression import func

async def get_unique_email_and_username(session, base_email, base_username):
    """Generate unique email and username."""
    email = base_email
    username = base_username
    suffix = 1
    while True:
        email_exists = (await session.exec(select(User).where(User.email == email))).first()
        username_exists = (await session.exec(select(User).where(User.username == username))).first()
        if not email_exists and not username_exists:
            return email, username
        # If exists, append a suffix and try again
        email_parts = base_email.split('@')
        email = f"{email_parts[0]}{suffix}@{email_parts[1]}"
        username = f"{base_username}{suffix}"
        suffix += 1

async def db_seeder(session):
    usertype_seeder(session)

    # # # USER_TYPE
    admin_user_type = UserType(name="admin")
    teacher_user_type = UserType(name="teacher")
    student_user_type = UserType(name="student")
    session.add_all([admin_user_type, teacher_user_type, student_user_type])
    await session.commit()  # ¡IMPORTANTE! Guardar primero los UserTypes

    # # SUBJECT
    subject = Subject(name="Language")
    maths = Subject(name="Maths")
    session.add_all([subject, maths])
    await session.commit()  # Guardar los Subjects

    # # USERS
    # CUSTOM USERS FOR TESTING
    # ADMIN
    user = UserFactory()
    admin_user_type = (await session.exec(select(UserType).where(UserType.name == "admin"))).first()
    if not admin_user_type:
        raise ValueError("Admin UserType not found")
    email, username = await get_unique_email_and_username(session, user.email, 'admintest')
    session.add(User(
        name=user.name,
        email=email,
        username=username,
        profile_pic=user.profile_pic,
        user_type_id = admin_user_type.id,
        hashed_password=get_password_hash('pass'),
        status='active'
    ))
    # TEACHER
    user = UserFactory()
    teacher_user_type = (await session.exec(select(UserType).where(UserType.name == "teacher"))).first()
    if not teacher_user_type:
        raise ValueError("Teacher UserType not found")
    email, username = await get_unique_email_and_username(session, user.email, 'teachertest')
    session.add(User(
        name=user.name,
        email=email,
        username=username,
        profile_pic=user.profile_pic,
        status='active',
        user_type_id = teacher_user_type.id,
        hashed_password=get_password_hash('pass')
    ))
    # STUDENT
    user = UserFactory()
    student_user_type = (await session.exec(select(UserType).where(UserType.name == "student"))).first()
    if not student_user_type:
        raise ValueError("Student UserType not found")
    email, username = await get_unique_email_and_username(session, user.email, 'studenttest')
    session.add(User(
        name=user.name,
        email=email,
        username=username,
        profile_pic=user.profile_pic,
        user_type_id = student_user_type.id,
        status='active',
        hashed_password=get_password_hash('pass')
    ))

    # MOCK USERS
    # ADMIN
    user = UserFactory()
    admin_user_type = (await session.exec(select(UserType).where(UserType.name == "admin"))).first()
    if not admin_user_type:
        raise ValueError("Admin UserType not found")
    
    for _ in range(5):
        user = UserFactory()
        email, username = await get_unique_email_and_username(session, user.email, user.email)
        session.add(User(
            name=user.name,
            email=email,
            username=username,
            profile_pic=user.profile_pic,
            user_type_id=admin_user_type.id,
            hashed_password=user.hashed_password,
            status=random.choice(['active', 'pending', 'inactive'])
    ))
    
    # TEACHERS
    teacher_user_type = (await session.exec(select(UserType).where(UserType.name == "teacher"))).first()
    if not teacher_user_type:
        raise ValueError("Teacher UserType not found")

    for _ in range(5):
        user = UserFactory()
        email, username = await get_unique_email_and_username(session, user.email, user.email)
        session.add(User(
            name=user.name,
            email=email,
            username=username,
            profile_pic=user.profile_pic,
            user_type_id=teacher_user_type.id,
            hashed_password=user.hashed_password,
            status=random.choice(['active', 'pending', 'inactive'])

        ))

    # STUDENTS
    student_user_type = (await session.exec(select(UserType).where(UserType.name == "student"))).first()
    if not student_user_type:
        raise ValueError("Student UserType not found")

    for _ in range(500):
        user = UserFactory()
        email, username = await get_unique_email_and_username(session, user.email, user.email)
        session.add(User(
            name=user.name,
            email=email,
            username=username,
            profile_pic=user.profile_pic,
            user_type_id=student_user_type.id,
            hashed_password=user.hashed_password,
            status=random.choice(['active', 'pending', 'inactive'])

        ))

    await session.commit()  # Guardar todos los usuarios

    # # TOPICS
    for _ in range(20):
        topic = TopicFactory()
        
        teacher_type = (await session.exec(select(UserType).where(UserType.name == "teacher"))).first()
        teacher = (await session.exec(
            select(User).where(User.user_type_id == teacher_type.id).order_by(func.random()).limit(1)
        )).first()
        
        subject = (await session.exec(select(Subject).order_by(func.random()).limit(1))).first()
        
        if not teacher or not subject:
            continue
            
        session.add(Topic(
            name=topic.name,
            description=topic.description,
            teacher_id=teacher.id,
            subject_id=subject.id
        ))

    await session.commit()

    # # LESSONS
    for _ in range(50):
        lesson = LessonFactory()
        topic = (await session.exec(select(Topic).order_by(func.random()).limit(1))).first()
        
        if not topic:
            continue

        # Randomly choose if lesson is in the past or future (50/50)
        now = datetime.now(timezone.utc)
        days_offset = random.randint(1, 60)  # up to 2 months in past/future
        if random.choice([True, False]):
            start_time = now - timedelta(days=days_offset)
        else:
            start_time = now + timedelta(days=days_offset)

        # Randomly choose duration: 1, 2, or 3 hours
        duration_hours = random.choice([1, 2, 3])
        end_time = start_time + timedelta(hours=duration_hours)
            
        session.add(Lesson(
            max_capacity=lesson.max_capacity,
            start_time=start_time,
            end_time=end_time,
            lesson_url=lesson.lesson_url,
            topic_id=topic.id
        ))

    await session.commit()

    # # ATTEND
    for _ in range(300):
        attend = AttendFactory()
        
        lesson = (await session.exec(select(Lesson).order_by(func.random()).limit(1))).first()
        if not lesson:
            continue

        # Count current attendance for this lesson
        attend_count = (await session.exec(
            select(func.count()).where(Attend.lesson_id == lesson.id)
        )).one()

        if attend_count >= lesson.max_capacity:
            continue  # Skip if lesson is full

        student_type = (await session.exec(select(UserType).where(UserType.name == "student"))).first()
        student = (await session.exec(
            select(User)
            .where(User.user_type_id == student_type.id)
            .order_by(func.random())
            .limit(1)
        )).first()

        if not student:
            continue  # Skip if no student found

        already_attended = (await session.exec(
            select(Attend)
            .where(Attend.lesson_id == lesson.id, Attend.student_id == student.id)
        )).first()

        if not already_attended:
            session.add(Attend(
                assistance=attend.assistance,
                lesson_id=lesson.id,
                student_id=student.id
            ))
            await session.commit()  # Commit inmediato
            await session.flush()


    # # FUNCIONA (ejemplos):
    # # 1. Selectionar uno
    # # msg = await session.get(User, 1)

    # # 2. Selecionar por atributos
    # # statement = select(User).where(User.id == 1)
    # # results = await session.exec(statement)
    # # print(results.first().id)

    # # 3. Selecionar todos
    # # statement = select(User)
    # # results = await session.exec(statement)
    # # print(results.all())

    # # # 4. Convertir Respuesta a JSON
    # # statement = select(User).where(User.user_type_id == 2)
    # # results = await session.exec(statement)
    # # users = results.all()
    # # users_json = [user.model_dump() for user in users]
    # # print(users_json)

    # # # 5. Seleciona, desorganiza y limita respuesta
    # # statement = select(User).where(User.user_type_id == 2).order_by(func.random()).limit(5)
    # # results = await session.exec(statement)
    # # users = results.all()
    # # users_json = [user.model_dump() for user in users]
    # # print(users_json)

    # # statement = select(User).where(User.user_type_id == 2).order_by(func.random())
    # # results = await session.exec(statement)
    # # teacher = results.first()
    # # print(teacher)

    await session.commit()

    print("Database seeded successfully!")
    return [{"Answer":"Database seeded successfully!"}]

async def db_seeder_deleter(session):
    tables = [Attend, Lesson, Topic, Subject, User, UserType]
    for table in tables:
        statement = delete(table)
        await session.exec(statement)
        # await session.execute(table.__table__.delete())
    await session.commit()
    
    print("Database deleted info successfully!")
    return [{"Answer":"Database deleted info successfully!"}]