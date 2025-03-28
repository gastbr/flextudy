from app.v1.repositories.fakers.seeders.usertype_seeder import usertype_seeder
from app.v1.models.user_type import UserType
from app.v1.models.user import User
from app.v1.repositories.fakers.factories.user_factory import UserFactory
from app.v1.repositories.fakers.factories.topic_factory import TopicFactory
from app.v1.models.subject import Subject
from app.v1.models.topic import Topic

from sqlalchemy.sql.expression import func



async def db_seeder(session):
    # usertype_seeder(session)

    admin_user_type = UserType(name="admin")
    session.add(admin_user_type)
    teacher_user_type = UserType(name="teacher")
    session.add(teacher_user_type)
    student_user_type = UserType(name="student")
    session.add(student_user_type)
    session.add_all([admin_user_type, teacher_user_type, student_user_type])

    subject = Subject(name="Language")
    maths = Subject(name="Maths")
    session.add_all([subject, maths])


    # ADMIN
    user = UserFactory()
    session.add(User(
        name=user.name,
        email=user.email,
        profile_pic=user.profile_pic,
        user_type_id = 1
    ))

    # PROFESORES
    for _ in range(5):  # Cambia el rango para crear más usuarios
        user = UserFactory()
        session.add(User(
            name=user.name,
            email=user.email,
            profile_pic=user.profile_pic,
            user_type_id=2
        ))

    # ALUMNOS
    for _ in range(50):  # Cambia el rango para crear más usuarios
        user = UserFactory()
        session.add(User(
            name=user.name,
            email=user.email,
            profile_pic=user.profile_pic,
            user_type_id=3
        ))

    
    # # Crear 20 TOPICS
    # for _ in range(20):
    #     topic = TopicFactory()
    #     teacher = session.query(User).filter_by(user_type_id=1).order_by(func.random()).first()
    #     teacher = session.query(User).filter_by(user_type_id=1).order_by(func.random()).first()
        
    #     session.add(Topic(
    #         name=topic.name,
    #         description=topic.description,
    #         teacher_id=teacher.id,
    #         subject_id=topic.subject_id
    #     ))

    # Guardar los usuarios creados
    await session.commit()

    print("Database seeded successfully!")
    return [] 