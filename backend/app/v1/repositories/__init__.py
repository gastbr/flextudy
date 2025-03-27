from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException
from typing import Any, Type

class BaseRepository:
    """
    Base repository class to handle generic operations in Database.
    """
    def __init__(self, db: AsyncSession, model: Type[Any]):
        """
        Constructor for BaseRepository to handle generic operations.

        :param db: Database session.
        :param model: Model class to use in repository operations.
        """
        self.db = db
        self.model = model

    async def read_all(self):
        """
        Retrieves all records of the model in the database.
        """
        result = await self.db.execute(select(self.model))
        return result.scalars().all()

    async def read(self, item_id: int):
        """
        Retrieves a specific record by ID.
        """
        obj = await self.db.get(self.model, item_id)
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
