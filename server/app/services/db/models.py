from sqlalchemy.orm import DeclarativeBase

from sqlalchemy import String, DateTime, func, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from uuid import uuid4

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "user"

    id: Mapped[str] = mapped_column(String, primary_key=True, server_default=uuid4().hex)
    username: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    email: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
    deleted_at: Mapped[DateTime | None] = mapped_column(DateTime, nullable=True)
    last_login: Mapped[DateTime | None] = mapped_column(DateTime, nullable=True)
    password_hash: Mapped[str] = mapped_column(String, nullable=True)

    def __repr__(self) -> str:
        return f"User(id={self.id}, username={self.username}, email={self.email})"
    
class Song(Base):
    __tablename__ = "song"

    id: Mapped[str] = mapped_column(String, primary_key=True, server_default=uuid4().hex)
    name: Mapped[str] = mapped_column(String, nullable=False)
    path: Mapped[str] = mapped_column(String, nullable=False)
    user_id: Mapped[str] = mapped_column(ForeignKey("user.id"))

    def __repr__(self) -> str:
        return f"Song(id={self.id}, name={self.name}"