from pydantic import BaseModel, EmailStr, conint
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
    email: EmailStr
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
    
    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

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
