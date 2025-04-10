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
        dt = fake.date_time_between(
            start_date='now', 
            end_date='+30d', 
            tzinfo=timezone.utc  
        )
        return dt.isoformat()
    
    @factory.lazy_attribute
    def end_time(self):
        hours_to_add = random.randint(1, 2)
        start_dt = datetime.fromisoformat(self.start_time)
        end_dt = start_dt + timedelta(hours=hours_to_add)
        return end_dt.isoformat()
    
    lesson_url = factory.Faker('image_url')