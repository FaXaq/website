from config import get_env_variable
from .models import Base
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.ext.asyncio.session import AsyncSession
from collections.abc import AsyncGenerator
from sqlalchemy.engine.url import make_url

database_uri = get_env_variable("DATABASE_URI")

# Parse and modify the URL
url = make_url(database_uri)
async_url = url.set(drivername="postgresql+asyncpg")

async_engine = create_async_engine(async_url, echo=False, future=True)

local_session = async_sessionmaker(bind=async_engine, class_=AsyncSession, expire_on_commit=False)
metadata = Base.metadata

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with local_session() as db:
        try:
            yield db
        finally:
            await db.close()