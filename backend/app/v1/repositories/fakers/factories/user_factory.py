import factory
from faker import Faker
from app.v1.models.user import User
from app.v1.models.user_type import UserType
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import func

fake = Faker()

class UserFactory(factory.Factory):
    class Meta:
        model = User

    name = factory.Faker('name')
    email = factory.Sequence(lambda n: f"user{n}@example.com")
    profile_pic = factory.Faker('image_url')
    user_type = factory.LazyAttribute(lambda _: UserTypeFactory.get_random_user_type())

    @staticmethod
    def get_random_user_type():
        session = Session()
        user_type = session.query(UserType).order_by(func.random()).first()
        session.close()
        return user_type