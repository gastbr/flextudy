from sqlmodel import SQLModel, Field, Relationship
from typing import List,Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from app.v1.models.subject import Subject

if TYPE_CHECKING:
    from app.v1.models.user import User
    
if TYPE_CHECKING:
    from app.v1.models.lesson import Lesson

class BaseTopic(SQLModel):
    name: str
    description: str

class Topic(BaseTopic, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    subject_id: Optional[int] = Field(default=None, foreign_key="subject.id")
    teacher_id: Optional[int] = Field(default=None, foreign_key="user.id")

    # Relationship
    subject: Optional["Subject"] = Relationship(back_populates="topics")
    teacher: Optional["User"] = Relationship(back_populates="topics")
    
    # List
    lessons: List["Lesson"] = Relationship(back_populates="topic")

class CreateTopic(BaseTopic):
    name: Optional[str] = None
    description: Optional[str] = None
    subject_id: Optional[int] = None
    teacher_id: Optional[int] = None

class UpdateTopic(BaseTopic):
    name: Optional[str] = None
    description: Optional[str] = None
    subject_id: Optional[int] = None
    teacher_id: Optional[int] = None

class ReadTopic(BaseTopic):
    id: int
    name: Optional[str] = None
    description: Optional[str] = None
    subject_id: Optional[int] = None
    teacher_id: Optional[int] = None