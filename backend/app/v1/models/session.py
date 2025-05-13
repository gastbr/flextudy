from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from app.v1.models.user import User

class BaseSession(SQLModel):
    token: str

class Session(BaseSession, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", unique=True)
    # Relación inversa
    user: Optional["User"] = Relationship(back_populates="session")

class CreateSession(BaseSession):
    pass

class UpdateSession(BaseSession):
    pass

class ReadSession(BaseSession):
    id: int
