from fastapi import FastAPI, Response, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
from psycopg2.extras import RealDictCursor
from .database import engine
from . import models
from .routers import post, user, auth, likes, repost

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    conn = psycopg2.connect(host='localhost', database='social_app', user='postgres', password='Ilovespacex123', cursor_factory=RealDictCursor)
    cursor = conn.cursor
    print("Database connection was successful")
except Exception as error:
    print("Connecting to database failed")
    print("Error: ", error)

app.include_router(post.router)
app.include_router(user.router)
app.include_router(auth.router)
app.include_router(likes.router)
app.include_router(repost.router)

@app.get("/")
def root():
    return {"message": "Welcome to my API"}

