from sqlmodel import SQLModel, Field, Relationship
from typing import Optional


class BaseAttend(SQLModel):
    assistance: bool

class Attend(BaseAttend, table=True):
    student_id: Optional[int] | None = Field(default=None, foreign_key="user.id", primary_key=True)
    lesson_id: Optional[int] | None = Field(default=None, foreign_key="lesson.id", primary_key=True)

class CreateAttend(BaseAttend):
    assistance: Optional[bool] = False
    lesson_id: Optional[int] = None
    student_id: Optional[int] = None

class UpdateAttend(BaseAttend):
    assistance: Optional[bool] = None
    lesson_id: Optional[int] = None
    student_id: Optional[int] = None

class ReadAttend(BaseAttend):
    assistance: Optional[bool] = None
    lesson_id: Optional[int] = None
    student_id: Optional[int] = None