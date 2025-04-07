from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload
from sqlalchemy.exc import ArgumentError
from fastapi import HTTPException
from typing import Any, Type

class BaseRepository:
    """
    Base repository class to handle generic operations in Database.
    """
    def __init__(self, db: AsyncSession, model: Type[Any], eager_load: list[str] = None):
        """
        Constructor for BaseRepository to handle generic operations.

        :param db: Database session.
        :param model: Model class to use in repository operations.
        :param eager_load: List of relationships to eager load (optional).
        """
        self.db = db
        self.model = model
        self.eager_load = eager_load or []

    def _resolve_relationships(self, statement, relationships: list[str]):
        """
        Resolves string relationship names to class-bound attributes and applies joinedload.

        :param statement: The SQLAlchemy statement to modify.
        :param relationships: List of relationship names to resolve.
        :return: Modified SQLAlchemy statement with joinedload options applied.
        """
        for relation in relationships:
            try:
                relationship_attr = getattr(self.model, relation)
                statement = statement.options(joinedload(relationship_attr))
            except ArgumentError:
                raise ValueError(f"Relationship '{relation}' not found on model '{self.model.__name__}'")
        return statement

    async def read_all(self):
        """
        Retrieves all records of the model in the database with optional eager loading.
        """
        statement = self._resolve_relationships(
            select(self.model),
            self.eager_load
        )
        result = await self.db.execute(statement)
        return result.scalars().all()

    async def read(self, item_id: int):
        """
        Retrieves a specific record by ID with optional eager loading.
        """
        statement = self._resolve_relationships(
            select(self.model).where(self.model.id == item_id),
            self.eager_load
        )
        result = await self.db.execute(statement)
        obj = result.scalar_one_or_none()
        if obj is None:
            raise HTTPException(status_code=404, detail=f"{self.model.__name__} not found")
        return obj

    async def create(self, data: Any) -> Any:
        """
        Creates a new record in the database.
        """
        self.db.add(data)
        await self.db.commit()
        await self.db.refresh(data)
        return data

    async def update(self, item: Any) -> Any:
        """
        Updates an existing record in the database.
        """
        await self.db.commit()
        await self.db.refresh(item)
        return item

    async def delete(self, item_id: int):
        """
        Deletes a specific record by ID.
        """
        obj = await self.read(item_id)  # Reuse the read method to get the item or raise a 404
        await self.db.delete(obj)
        await self.db.commit()
