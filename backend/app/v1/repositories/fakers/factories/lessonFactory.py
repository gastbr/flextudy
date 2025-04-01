import factory
from faker import Faker
from sqlalchemy.sql.expression import func
from app.v1.models.lesson import Lesson
import random
from datetime import timedelta

fake = Faker()

class LessonFactory(factory.Factory):
    class Meta:
        model = Lesson

    max_capacity = factory.Faker('random_int', min=8, max=15)
    start_time = factory.Faker('date_time_between', start_date='now', end_date='+30d')
    
    @factory.lazy_attribute
    def end_time(self):
        # Add 1 or 2 hours to start_time
        hours_to_add = random.randint(1, 2)
        return self.start_time + timedelta(hours=hours_to_add)
    
    lesson_url = factory.Faker('image_url')