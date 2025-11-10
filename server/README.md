# Prerequisites
- python3
- pip
- pipenv

# Install
- pipenv install

# Start
- `.bin/server.sh`

# Migrations
- Generate migration : `pipenv run alembic revision --autogenerate -m "Migration name"`
- DryRun : `pipenv run alembic upgrade head --sql`
- Apply migration : `pipenv run alembic upgrade head`