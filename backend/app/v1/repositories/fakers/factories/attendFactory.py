import factory
from faker import Faker
from sqlalchemy.sql.expression import func
from app.v1.models.attend import Attend
import random
fake = Faker()

class AttendFactory(factory.Factory):
    class Meta:
        model = Attend

    assistance = factory.Faker('boolean')
