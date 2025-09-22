from fastapi import FastAPI, Response, status, HTTPException
import psycopg2
from psycopg2.extras import RealDictCursor
from .database import engine
from . import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

try:
    conn = psycopg2.connect(host='localhost', database='social_app', user='postgres', password='Ilovespacex123', cursor_factory=RealDictCursor)
    cursor = conn.cursor
    print("Database connection was successful")
except Exception as error:
    print("Connecting to database failed")
    print("Error: ", error)

@app.get("/")
def root():
    return {"message": "Welcome to my API"}

