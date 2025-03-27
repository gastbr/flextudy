import os
from fastapi import FastAPI
from app.v1.routes import router as api_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="ISSEC API")

origins = [
    "http://localhost",
    "http://localhost:5432",
    "http://localhost:8080",
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