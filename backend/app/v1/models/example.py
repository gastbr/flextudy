from sqlmodel import SQLModel, Field
from typing import Optional

class BaseExample(SQLModel):
    name: str
    description: Optional[str] = None
    other: Optional[str] = None

class Example(BaseExample, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

class CreateExample(BaseExample):
    pass

class UpdateExample(BaseExample):
    name: Optional[str] = None
    description: Optional[str] = None

class ReadExample(BaseExample):
    id: int