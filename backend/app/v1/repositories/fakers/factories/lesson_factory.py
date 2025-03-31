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

    max_capacity = factory.Faker('random_int', min=8, max=15)

    # # Fecha de inicio: desde hoy hasta 30 días en el futuro
    # start_time = factory.Faker('date_time_between', start_date='now', end_date='+30d')
    
    # # Fecha de fin: 1 o 2 horas después de start_time
    # @factory.lazy_attribute
    # def end_time(self):
    #     delta_hours = fake_faker.random_int(min=1, max=2)
    #     return self.start_time + timedelta(hours=delta_hours)

    lesson_url = factory.Faker('image_url')
    topic_id = factory.Faker('random_int', min=1, max=3)

    # @staticmethod
    # def get_random_user_type_id():
    #     with SessionLocal() as session:
    #         user_type = session.query(UserType).order_by(func.random()).first()
    #         return user_type.id if user_type else None