import factory
from faker import Faker
from sqlalchemy.sql.expression import func
from app.v1.models.lesson import Lesson
import random
fake = Faker()

class LessonFactory(factory.Factory):
    class Meta:
        model = Lesson

    max_capacity = factory.Faker('random_int', min=8, max=15)
    # Fecha de inicio: desde hoy hasta 30 días en el futuro
    start_time = factory.Faker('date_time_between', start_date='now', end_date='+30d')
    # Fecha de fin: 1 o 2 horas después de start_time
    end_time = factory.Faker('date_time_between', start_date=start_time, end_date=f'+{random.randint(1,2)}h')
    lesson_url = factory.Faker('image_url')