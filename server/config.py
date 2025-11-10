from os import getenv
from dotenv import load_dotenv

load_dotenv()


db_uri = getenv("DATABASE_URI")
jwt_secret = getenv("JWT_SECRET")

if db_uri is None:
    raise EnvironmentError("DATABASE_URI environment variable not set")

if jwt_secret is None:
    raise EnvironmentError("JWT_SECRET environment variable not set")

def get_env_variable(name: str) -> str:
    value = getenv(name)
    if value is None:
        raise EnvironmentError(f"{name} environment variable not set")
    return value