from fastapi import APIRouter
from app.config.routes import include_route

# Import specific routes
# Example: from app.v1.routes.file import file
from app.v1.routes.example_route import router as example_router

router = APIRouter()

# Custom routes
# Example: include_route(router, file_route, prefix="/file", tags=["file"])
include_route(router, example_router, prefix="/example", tags=["example"])

# Generic routes

# # Projects routes
include_route(router, "user_type", prefix="/user_type", tags=["User Type"])
include_route(router, "user", prefix="/user", tags=["User"])
include_route(router, "lesson", prefix="/lesson", tags=["Lesson"])
include_route(router, "subject", prefix="/subject", tags=["Subject"])
include_route(router, "topic", prefix="/topic", tags=["Topic"])
include_route(router, "attend", prefix="/attend", tags=["Attend"])





__all__ = ["router"]


