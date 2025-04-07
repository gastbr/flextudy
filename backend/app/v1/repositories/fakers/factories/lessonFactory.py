import factory
from faker import Faker
from app.v1.models.lesson import Lesson
import random
from datetime import datetime, timedelta, timezone

fake = Faker()

class LessonFactory(factory.Factory):
    class Meta:
        model = Lesson

    max_capacity = factory.Faker('random_int', min=8, max=15)
    
    @factory.lazy_attribute
    def start_time(self):
        # Genera un datetime con zona horaria UTC
        dt = fake.date_time_between(
            start_date='now', 
            end_date='+30d', 
            tzinfo=timezone.utc  # Fuerza UTC
        )
        return dt
    
    @factory.lazy_attribute
    def end_time(self):
        # Añade 1 o 2 horas al start_time (ya en UTC)
        hours_to_add = random.randint(1, 2)
        return self.start_time + timedelta(hours=hours_to_add)
    
    lesson_url = factory.Faker('image_url')