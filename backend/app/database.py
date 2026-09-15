import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# load variables from .env file
load_dotenv()

# get DB info from the .env (:
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")


# MySQL connection URL...
DATABASE_URL = (
    f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
)
print("===========================================================")
print(f"For Testing Purposes Connecting to {DATABASE_URL}")
print("===========================================================")

# Create connection to database
engine = create_engine(DATABASE_URL)

# Create database sessionnnn
SessionLocal = sessionmaker(
    autocommit = False,
    autoflush = False,
    bind=engine
)

Base = declarative_base()


# Give FastAPI routes a database connection
def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()