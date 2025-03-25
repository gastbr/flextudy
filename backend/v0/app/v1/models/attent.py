from sqlmodel import SQLModel, Field, Relationship
from typing import Optional


class BaseAttent(SQLModel):
    assistance: bool

class Attent(BaseAttent, table=True):
    student_id: Optional[int] | None = Field(default=None, foreign_key="user.id", primary_key=True)
    lesson_id: Optional[int] | None = Field(default=None, foreign_key="lesson.id", primary_key=True)

class CreateAttent(BaseAttent):
    assistance: Optional[bool] = False
    lesson_id: Optional[int] = None
    student_id: Optional[int] = None

class UpdateAttent(BaseAttent):
    assistance: Optional[bool] = None
    lesson_id: Optional[int] = None
    student_id: Optional[int] = None

class ReadAttent(BaseAttent):
    assistance: Optional[bool] = None
    lesson_id: Optional[int] = None
    student_id: Optional[int] = None