from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from app.v1.models.user_type import UserType
if TYPE_CHECKING:
    from app.v1.models.topic import Topic
if TYPE_CHECKING:
    from app.v1.models.lesson import Lesson

from app.v1.models.attent import Attent 

class BaseUser(SQLModel):
    name: str
    email: str
    profile_pic: str

class User(BaseUser, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_type_id: Optional[int] = Field(default=None, foreign_key="usertype.id")

    # Relationship to UserType
    user_type: Optional["UserType"] = Relationship(back_populates="users")
    
    # List
    topics: List["Topic"] = Relationship(back_populates="teacher")
        #Many to Many
    lessons: List["Lesson"] = Relationship(back_populates="students", link_model=Attent)


class CreateUser(BaseUser):
    name: Optional[str] = None
    email: Optional[str] = None
    profile_pic: Optional[str] = None
    user_type_id: Optional[int] = None


class UpdateUser(BaseUser):
    name: Optional[str] = None
    email: Optional[str] = None
    profile_pic: Optional[str] = None
    user_type_id: Optional[int] = None

class ReadUser(BaseUser):
    id: int
    name: Optional[str] = None
    email: Optional[str] = None
    profile_pic: Optional[str] = None
    user_type_id: Optional[int] = None