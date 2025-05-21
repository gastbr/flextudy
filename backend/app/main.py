from fastapi import FastAPI
from app.v1.routes import router as api_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="FLEXTUDY API")

origins = [
    "http://localhost:8000",
    "http://localhost:3000",
    "http://fastapi:8000",
    "http://frontend:3000",
    "http://fastapi",
    "http://frontend",
    "http://127.0.0.1:3000",
    "https://guillermo.informaticamajada.es"
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