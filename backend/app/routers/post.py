from fastapi import Response, status, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
from sqlalchemy import func, select
from sqlalchemy.orm import joinedload
from typing import List, Optional
from .. import models, schemas, oauth2
from ..database import get_db

router = APIRouter(
    prefix="/posts",
    tags=['Posts']
)

@router.get("/", response_model=List[schemas.PostOut])
def get_posts(db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)):
    likes_subquery = select(
        models.Like.post_id, 
        func.count(models.Like.user_id).label("likes")
    ).group_by(models.Like.post_id).subquery()

    reposts_subquery = select(
        models.Repost.post_id,
        func.count(models.Repost.user_id).label("reposts")
    ).group_by(models.Repost.post_id).subquery()

    results = db.query(
        models.Post, 
        func.coalesce(likes_subquery.c.likes, 0).label("likes"),
        func.coalesce(reposts_subquery.c.reposts, 0).label("reposts")
    ).outerjoin(
        likes_subquery, likes_subquery.c.post_id == models.Post.id
    ).outerjoin(
        reposts_subquery, reposts_subquery.c.post_id == models.Post.id
    ).options(
        joinedload(models.Post.owner)
    ).all()
    return results

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.Post)
def create_posts(post: schemas.PostCreate, db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)):
    new_post = models.Post(owner_id=current_user.id, **post.model_dump())
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post

@router.get("/user/{username}", response_model=List[schemas.PostOut])
def get_posts_by_user(username: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with username: {username} does not exist")
    
    likes_subquery = select(
        models.Like.post_id, 
        func.count(models.Like.user_id).label("likes")
    ).group_by(models.Like.post_id).subquery()

    reposts_subquery = select(
        models.Repost.post_id,
        func.count(models.Repost.user_id).label("reposts")
    ).group_by(models.Repost.post_id).subquery()

    results = db.query(
        models.Post, 
        func.coalesce(likes_subquery.c.likes, 0).label("likes"),
        func.coalesce(reposts_subquery.c.reposts, 0).label("reposts")
    ).outerjoin(
        likes_subquery, likes_subquery.c.post_id == models.Post.id
    ).outerjoin(
        reposts_subquery, reposts_subquery.c.post_id == models.Post.id
    ).options(
        joinedload(models.Post.owner)
    ).filter(models.Post.owner_id == user.id).all()

    return results
