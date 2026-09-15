from fastapi import FastAPI
from app.database import engine
from sqlalchemy import text


# create instance of app!
app = FastAPI()


# this is the root "home"
@app.get("/")
def root():
    try:
        with engine.connect() as connection:
            connection.execute(
                text("SELECT 1")
            )
            return {
                "status" : "success",
                "msg " : "Database Connected Successfully"
            }

    except Exception as e:
        return {
            "status" : "Error",
            "msg" : str(e)
        }