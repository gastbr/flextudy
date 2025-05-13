# Import all models
# Example: from app.v1.models.example import Example
from app.v1.models.user import User
from app.v1.models.user_type import UserType
from app.v1.models.lesson import Lesson
from app.v1.models.topic import Topic
from app.v1.models.subject import Subject
from app.v1.models.attend import Attend
from app.v1.models.session import Session

# List all models to be registered
# Example: all_models = [File, User]

all_models = [
    User,
    UserType,
    Lesson,
    Topic,
    Subject,
    Attend,
    Session
]
