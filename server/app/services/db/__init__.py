import sqlalchemy as db
from config import get_env_variable
from .models import Base

engine = db.create_engine(get_env_variable("DATABASE_URI"))
metadata = Base.metadata