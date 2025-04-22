from fastapi import FastAPI
from app.v1.routes import router as api_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="FLEXTUDY API")

origins = [
    "http://localhost:8000",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routes from the centralized router

app.include_router(api_router, prefix="/v1")