import os
from fastapi import FastAPI
from app.v1.routes import router as api_router

app = FastAPI(title="ISSEC API")

# Include all routes from the centralized router
app.include_router(api_router, prefix="/v1")