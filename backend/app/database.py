
import os
import ssl

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from sqlalchemy.orm import sessionmaker, declarative_base

# Load variables from .env file
load_dotenv()

# Get DB info from environment variables
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")

# Default to local MySQL port unless otherwise specified
DB_PORT = int(os.getenv("DB_PORT", "3306"))

# URL.create safely handles special characters in database credentials.
DATABASE_URL = URL.create(
    "mysql+pymysql",
    username=DB_USER,
    password=DB_PASSWORD,
    host=DB_HOST,
    port=DB_PORT,
    database=DB_NAME,
)

# Configure SSL for cloud-hosted databases
connection_options = {}

ca_certificate = os.getenv("DB_SSL_CA")

if ca_certificate:
    ssl_context = ssl.create_default_context(
        cadata=ca_certificate.replace("\\n", "\n")
    )
    ssl_context.verify_mode = ssl.CERT_REQUIRED
    ssl_context.check_hostname = True

    connection_options["ssl"] = ssl_context

# Create database engine
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    connect_args=connection_options,
)

# Create database session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


# Give FastAPI routes a database connection
def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()
