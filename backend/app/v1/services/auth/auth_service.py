import jwt
from jwt.exceptions import InvalidTokenError
from typing import Annotated, Optional
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession
from dotenv import load_dotenv
from app.v1.models.user import TokenData
from app.v1.repositories.users_repository import get_user_by_username
from app.config.db import get_session
import os

load_dotenv()

API_URL = os.getenv("API_URL")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 15))

TOKENURL = f"{API_URL}/auth/login"

class OAuth2PasswordBearerCookie(OAuth2PasswordBearer):
    async def __call__(self, request: Request) -> Optional[str]:
        # Attempt to retrieve the token from the cookies using the key "token"
        token_from_cookie = request.cookies.get("token")
        if token_from_cookie:
            return token_from_cookie
        
        # Fallback to the default mechanism (i.e., Authorization header)
        token_from_header = await super().__call__(request)
        return token_from_header

# oauth2_scheme = OAuth2PasswordBearer(tokenUrl=TOKENURL, scheme_name="Bearer")
oauth2_scheme = OAuth2PasswordBearerCookie(tokenUrl=TOKENURL, scheme_name="Bearer")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

async def authorize(
        token: Annotated[str, Depends(oauth2_scheme)],
        db: Annotated[AsyncSession, Depends(get_session)]
        ):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception
    user = await get_user_by_username(db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

""" async def isUserRole(role: str, user: User, session) -> bool:
        userRole = (await session.exec(select(UserType).where(UserType.id == user.user_type_id))).first()
        if userRole.name == role:
            return True
        else:
            return False
# role = await isUserRole("admin", user, session) """