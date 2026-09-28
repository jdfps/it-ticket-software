from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.database import engine
from app.routers import auth, users, tickets, comments, categories

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

    except Exception as e:
        return {
            "status": "error",
            "msg": str(e),
        }