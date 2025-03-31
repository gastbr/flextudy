from sqlmodel import select
from app.v1.repositories.fakers.seeders.usertype_seeder import usertype_seeder
from app.v1.models.user_type import UserType
from app.v1.models.user import User
from app.v1.repositories.fakers.factories.user_factory import UserFactory
from app.v1.repositories.fakers.factories.topic_factory import TopicFactory
# from app.v1.repositories.fakers.factories.lesson_factory import LessonFactory
from app.v1.models.subject import Subject
from app.v1.models.topic import Topic
from app.v1.models.lesson import Lesson


from sqlmodel import select
from sqlalchemy.sql.expression import func



async def db_seeder(session):
    # usertype_seeder(session)

    # admin_user_type = UserType(name="admin")
    # session.add(admin_user_type)
    # teacher_user_type = UserType(name="teacher")
    # session.add(teacher_user_type)
    # student_user_type = UserType(name="student")
    # session.add(student_user_type)
    # session.add_all([admin_user_type, teacher_user_type, student_user_type])



    # subject = Subject(name="Language")
    # maths = Subject(name="Maths")
    # session.add_all([subject, maths])


    # # ADMIN
    # user = UserFactory()
    # session.add(User(
    #     name=user.name,
    #     email=user.email,
    #     profile_pic=user.profile_pic,
    #     user_type_id = 1
    # ))

    # # PROFESORES
    # for _ in range(5):  # Cambia el rango para crear más usuarios
    #     user = UserFactory()
    #     session.add(User(
    #         name=user.name,
    #         email=user.email,
    #         profile_pic=user.profile_pic,
    #         user_type_id=2
    #     ))

    # # ALUMNOS
    # for _ in range(50):  # Cambia el rango para crear más alumnos
    #     user = UserFactory()
    #     session.add(User(
    #         name=user.name,
    #         email=user.email,
    #         profile_pic=user.profile_pic,
    #         user_type_id=3
    #     ))

    
    # TOPICS
    # for _ in range(20):
    #     topic = TopicFactory()
    #     # subject = select(Subject).where(User.user_type_id == 1).filter_by(user_type_id=1).order_by(func.random()).first()

    #     # teacher = session.query(User).filter_by(user_type_id=1).order_by(func.random()).first()
    #     statement = select(User).where(User.id == 1)
    #     results = await session.exec(statement)
    #     teacher = results.first().id

    #     statement = select(Subject).order_by(func.random())
    #     results = await session.exec(statement)
    #     subject = results.first().id

        
    #     session.add(Topic(
    #         name=topic.name,
    #         description=topic.description,
    #         teacher_id=teacher,
    #         subject_id=subject
    #     ))

    # # Lessons
    # for _ in range(20):
    #     lessons = Lesson()
    #     # subject = select(Subject).where(User.user_type_id == 1).filter_by(user_type_id=1).order_by(func.random()).first()

    #     # teacher = session.query(User).filter_by(user_type_id=1).order_by(func.random()).first()
    #     statement = select(User).where(User.id == 1)
    #     results = await session.exec(statement)
    #     teacher = results.first().id

    #     statement = select(Subject).order_by(func.random())
    #     results = await session.exec(statement)
    #     subject = results.first().id

        
    #     session.add(Topic(
    #         name=topic.name,
    #         description=topic.description,
    #         teacher_id=teacher,
    #         subject_id=subject
    #     ))


    # FUNCIONA (ejemplos):
    # 1. Selectionar uno
    # msg = await session.get(User, 1)

    # 2. Selecionar por atributos
    # statement = select(User).where(User.id == 1)
    # results = await session.exec(statement)
    # print(results.first().id)

    # 3. Selecionar todos
    # statement = select(User)
    # results = await session.exec(statement)
    # print(results.all())

    # # 4. Convertir Respuesta a JSON
    # statement = select(User).where(User.user_type_id == 2)
    # results = await session.exec(statement)
    # users = results.all()
    # users_json = [user.model_dump() for user in users]
    # print(users_json)

    # # 5. Seleciona, desorganiza y limita respuesta
    # statement = select(User).where(User.user_type_id == 2).order_by(func.random()).limit(5)
    # results = await session.exec(statement)
    # users = results.all()
    # users_json = [user.model_dump() for user in users]
    # print(users_json)

    # statement = select(User).where(User.user_type_id == 2).order_by(func.random())
    # results = await session.exec(statement)
    # teacher = results.first()
    # print(teacher)


    # LESSON

    


    await session.commit()

    print("Database seeded successfully!")
    return [{"Answer":"Seeder done"}]
