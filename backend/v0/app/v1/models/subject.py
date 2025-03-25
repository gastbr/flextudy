from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from app.v1.models.topic import Topic 

class BaseSubject(SQLModel):
    name: str

class Subject(BaseSubject, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    
    topics: List["Topic"] = Relationship(back_populates="subject")

    
class CreateSubject(BaseSubject):
    name: Optional[str] = None

class UpdateSubject(BaseSubject):
    name: Optional[str] = None


class ReadSubject(BaseSubject):
    id: int