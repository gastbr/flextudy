import factory
from faker import Faker
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import func
from app.v1.models.topic import Topic
from app.v1.models.subject import Subject
from app.v1.models.user import User
from app.config.db import SessionLocal

fake = Faker()

class TopicFactory(factory.Factory):
    class Meta:
        model = Topic

    name = factory.Faker('name')
    description = factory.Faker('email')

    teacher_id = 1
    subject_id = 1

    @staticmethod
    def get_random_admin_id():
        with SessionLocal() as session:
            admin_user = session.query(User).filter_by(user_type_id=1).order_by(func.random()).first()
            return admin_user.id if admin_user else None

    @staticmethod
    def get_random_subject_id():
        with SessionLocal() as session:
            subject = session.query(Subject).order_by(func.random()).first()
            return subject.id if subject else None
