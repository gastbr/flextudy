import factory
from faker import Faker
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import func
from app.v1.models.user import User
from app.v1.models.user_type import UserType
from app.config.db import SessionLocal

fake = Faker()

class UserFactory(factory.Factory):
    class Meta:
        model = User

    name = factory.Faker('name')
    email = factory.Sequence(lambda n: f"user{n}@example.com")
    profile_pic = factory.Faker('image_url')
    user_type_id = factory.LazyAttribute(lambda _: UserFactory.get_random_user_type_id())

    @staticmethod
    def get_random_user_type_id():
        with SessionLocal() as session:
            user_type = session.query(UserType).order_by(func.random()).first()
            return user_type.id if user_type else None