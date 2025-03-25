# Import all models
# Example: from app.v1.models.example import Example
from app.v1.models.example import Example
from app.v1.models.my_route import MyRoute
from app.v1.models.user_type import UserType
from app.v1.models.user import User
from app.v1.models.lesson import Lesson
from app.v1.models.topic import Topic
from app.v1.models.subject import Subject
from app.v1.models.attent import Attent



# List all models to be registered
# Example: all_models = [File, User]

all_models = [
    Example,
    MyRoute,
    UserType,
    User,
    Lesson,
    Topic,
    Subject,
    Attent
]

