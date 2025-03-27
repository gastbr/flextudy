# app/v1/routes/base_route.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.config.db import get_session
from app.v1.repositories import BaseRepository
import importlib
from typing import List, Type, Any
from pydantic import BaseModel

class BaseRoute:
    def __init__(self, model_name: str):
        """
        Base class for configuring CRUD endpoints dynamically.

        :param model_name: Name of the model in snake_case format.
        """
        self.router = APIRouter()
        self.model_name = model_name
        main_model = self._load_model_class(model_name)
        read_model = self._load_model_class(model_name, "Read")
        create_model = self._load_model_class(model_name, "Create")
        update_model = self._load_model_class(model_name, "Update")

        # Register routes in the router, passing models as arguments
        self.router.get(f"/{model_name}", response_model=List[read_model])(self.read_all(main_model))
        self.router.get(f"/{model_name}/{{item_id}}", response_model=read_model)(self.read(main_model))
        self.router.post(f"/{model_name}", response_model=read_model)(self._typed_create(main_model, create_model))
        self.router.put(f"/{model_name}/{{item_id}}", response_model=read_model)(self._typed_update(main_model, update_model))
        self.router.delete(f"/{model_name}/{{item_id}}", response_model=dict)(self.delete(main_model))

    def _load_model_class(self, model_name: str, suffix: str = "") -> Type[BaseModel]:
        """
        Dynamically loads a model class based on the given suffix.
        """
        class_name = f"{suffix}{''.join(word.capitalize() for word in model_name.split('_'))}"
        module = importlib.import_module(f"app.v1.models.{model_name}")
        return getattr(module, class_name)

    def read_all(self, main_model):
        """
        Returns a typed read_all endpoint for documentation and validation.
        """
        async def read_all_endpoint(db: AsyncSession = Depends(get_session)):
            repository = BaseRepository(db, main_model)
            return await repository.read_all()
        return read_all_endpoint

    def read(self, main_model):
        """
        Returns a typed read endpoint for documentation and validation.
        """
        async def read_endpoint(item_id: int, db: AsyncSession = Depends(get_session)):
            repository = BaseRepository(db, main_model)
            return await repository.read(item_id)
        return read_endpoint

    def _typed_create(self, main_model, create_model):
        """
        Returns a typed create endpoint for documentation and validation.
        """
        async def create_endpoint(item: create_model, db: AsyncSession = Depends(get_session)):
            item_data = self._process_item(item)
            new_item = main_model(**item_data)
            repository = BaseRepository(db, main_model)
            return await repository.create(new_item)
        return create_endpoint

    def _typed_update(self, main_model, update_model):
        """
        Returns a typed update endpoint for documentation and validation.
        """
        async def update_endpoint(item_id: int, item: update_model, db: AsyncSession = Depends(get_session)):
            item_data = self._process_item(item)
            repository = BaseRepository(db, main_model)
            existing_item = await repository.read(item_id)
            for key, value in item_data.items():
                setattr(existing_item, key, value)
            return await repository.update(existing_item)
        return update_endpoint

    def delete(self, main_model):
        """
        Returns a typed delete endpoint for documentation and validation.
        """
        async def delete_endpoint(item_id: int, db: AsyncSession = Depends(get_session)):
            repository = BaseRepository(db, main_model)
            await repository.delete(item_id)
            return {"message": f"{main_model.__name__} with ID {item_id} deleted successfully."}
        return delete_endpoint

    def _process_item(self, item: Any) -> dict:
        """
        Converts the item object into a dictionary, handling different input formats.
        """
        if isinstance(item, str):
            import json
            try:
                return json.loads(item)
            except json.JSONDecodeError:
                raise HTTPException(status_code=400, detail="Invalid JSON format for item.")
        elif isinstance(item, dict):
            return item
        elif hasattr(item, "dict"):
            return item.dict()
        else:
            raise HTTPException(status_code=400, detail="Invalid item format.")
