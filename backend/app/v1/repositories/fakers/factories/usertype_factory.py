import factory
from faker import Faker
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import func
from app.v1.models.user_type import UserType
from app.config.db import SessionLocal

fake = Faker()

# Define nameType como una variable (puedes asignarle un valor o dejarla como None)
nameType = None  # Cambia esto según sea necesario

class UserTypeFactory(factory.Factory):
    class Meta:
        model = UserType

    # Usa un operador ternario para asignar el valor a name
    name = nameType if nameType else factory.Faker('name')

    # @staticmethod
    # def get_random_user_type_id():
    #     with SessionLocal() as session:
    #         user_type = session.query(UserType).order_by(func.random()).first()
    #         return user_type.id if user_type else None