from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from app.v1.models.user_type import UserType
if TYPE_CHECKING:
    from app.v1.models.topic import Topic
if TYPE_CHECKING:
    from app.v1.models.lesson import Lesson

from app.v1.models.attend import Attend 

class BaseUser(SQLModel):
    username: str = Field(index=True, unique=True)
    name: str
    email: str = Field(index=True, unique=True)
    profile_pic: str
    status: str = Field(default="pending")

class Pagination(SQLModel):
    total: int
    per_page: int
    current_page: int
    total_pages: int

class AuthenticatedUser(BaseUser):
    is_active: bool = Field(default=True)

class User(BaseUser, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_type_id: Optional[int] = Field(default=None, foreign_key="usertype.id")
    hashed_password: str

    # Relationship to UserType
    user_type: Optional["UserType"] = Relationship(back_populates="users")
    
    # List
    topics: List["Topic"] = Relationship(back_populates="teacher")
    #Many to Many
    lessons: List["Lesson"] = Relationship(back_populates="students", link_model=Attend)

    @property
    def user_type_name(self) -> Optional[str]:
        return self.user_type.name if self.user_type else None

class CreateUser(BaseUser):
    name: Optional[str] = None
    email: Optional[str] = None
    profile_pic: Optional[str] = None
    user_type_name: Optional[str] = 'student'
    password: Optional[str] = None

class UpdateUser(BaseUser):
    username: Optional[str] = None
    name: Optional[str] = None
    email: Optional[str] = None
    profile_pic: Optional[str] = 'https://avatar.iran.liara.run/username?username=string'
    user_type_name: Optional[str] = 'student'
    status: Optional[str] = 'inactive'

class ReadUser(BaseUser):
    name: Optional[str] = None
    email: Optional[str] = None
    profile_pic: Optional[str] = None
    user_type_name: Optional[str] = None
    status: Optional[str] = None

class ReadUserList(SQLModel):
    data: List[ReadUser]
    meta: Pagination

class Token(SQLModel):
    access_token: str
    token_type: str

class TokenData(SQLModel):
    username: Optional[str] = None

class UserLogin(SQLModel):
    username: str
    password: str
