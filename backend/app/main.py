from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app import models
from app.database import SessionLocal

from app.database import engine
from app.routers import auth, users, tickets, comments, categories, setup

app = FastAPI(title="IT Ticket Software API")

# Allow the Vite dev server to call this API.
# Add your deployed frontend's URL here too once you host it.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def prepare_installation_state():
    # Safe for existing databases: create ONLY the new installation_state table.
    # No drop/rebuild of users, tickets, or other application data.
    models.InstallationState.__table__.create(bind=engine, checkfirst=True)
    with engine.begin() as conn:
        conn.execute(text("INSERT IGNORE INTO installation_state (id, initialized) VALUES (1, FALSE)"))
        # Existing installations are already initialized: never let removal
        # of the original users reopen public first-time setup.
        conn.execute(text("UPDATE installation_state SET initialized = TRUE WHERE id = 1 AND EXISTS (SELECT 1 FROM users LIMIT 1)"))


app.include_router(setup.router)
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(tickets.router)
app.include_router(comments.router)
app.include_router(categories.router)


# this is the root "home" - quick DB connectivity check
@app.get("/")
def root():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
            return {
                "status": "success",
                "msg": "Database connected successfully",
            }

    except Exception:
        return {
            "status": "error",
            "msg": "Database unavailable",
        }