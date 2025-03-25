from sqlmodel import SQLModel, Field
from typing import Optional

class BaseMyRoute(SQLModel):
    name: str
    description: Optional[str] = None
    other: Optional[str] = None

class MyRoute(BaseMyRoute, table=True):
    __tablename__ = "my_route"
    id: Optional[int] = Field(default=None, primary_key=True)

class CreateMyRoute(BaseMyRoute):
    pass

class UpdateMyRoute(BaseMyRoute):
    name: Optional[str] = None
    description: Optional[str] = None

class ReadMyRoute(BaseMyRoute):
    id: int