from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING


if TYPE_CHECKING:
    from app.v1.models.topic import Topic
if TYPE_CHECKING:
    from app.v1.models.user import User
if TYPE_CHECKING:
    from app.v1.models.lesson import Attent 

from app.v1.models.attent import Attent 

class BaseLesson(SQLModel):
    max_capacity: int
    start_time: str
    end_time: str
    lesson_url: str

class Lesson(BaseLesson, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    topic_id: Optional[int] = Field(default=None, foreign_key="topic.id")
    
    # Relationship
    topic: Optional["Topic"] = Relationship(back_populates="lessons")
    
    #Many to Many
    students: list["User"] = Relationship(back_populates="lessons", link_model=Attent)

class CreateLesson(BaseLesson):
    max_capacity: Optional[int] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    lesson_url: Optional[str] = None
    topic_id: Optional[int] = None

class UpdateLesson(BaseLesson):
    max_capacity: Optional[int] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    lesson_url: Optional[str] = None
    topic_id: Optional[int] = None

class ReadLesson(BaseLesson):
    id: int
    max_capacity: Optional[int] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    lesson_url: Optional[str] = None
    topic_id: Optional[int] = None