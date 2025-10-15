from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, Literal

# For the user sending data to us
class PostBase(BaseModel):
    content: str
    published: bool = True

class PostCreate(PostBase):
    pass

# the shape when we send back the user to the client that requested it
class Userout(BaseModel):
    id: int
    name: str
    username: str
    email: EmailStr
    bio: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# schema for response
class Post(PostBase):
    id: int
    created_at: datetime
    owner_id: int
    owner: Userout

    class Config:
        from_attributes = True

class PostOut(BaseModel):
    Post: Post
    likes: int
    reposts: int
    liked_by_user: bool
    
    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    name: str
    bio: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: Optional[int] = None

class Like(BaseModel):
    post_id: int
    dir: Literal[0, 1]

class Repost(BaseModel):
    post_id: int
    dir: Literal[0, 1]

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str
    