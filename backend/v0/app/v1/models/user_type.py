from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from app.v1.models.user import User

class BaseUserType(SQLModel):
    name: str

class UserType(BaseUserType, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # Lists
    users: List["User"] = Relationship(back_populates="user_type")

class CreateUserType(BaseUserType):
    pass

class UpdateUserType(BaseUserType):
    name: Optional[str] = None

class ReadUserType(BaseUserType):
    id: int