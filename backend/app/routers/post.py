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
def get_posts(db: Session = Depends(get_db), current_user: Optional[models.User] = Depends(oauth2.get_current_user_optional)):
    likes_cte = (
        select(models.Like.post_id, func.count(models.Like.user_id).label("likes"))
        .group_by(models.Like.post_id)
        .cte("likes_cte")
    )
    reposts_cte = (
        select(models.Repost.post_id, func.count(models.Repost.user_id).label("reposts"))
        .group_by(models.Repost.post_id)
        .cte("reposts_cte")
    )

    if current_user:
        user_likes_cte = (
            select(models.Like.post_id.label("post_id"))
            .where(models.Like.user_id == current_user.id)
            .cte("user_likes_cte")
        )
    else:
        user_likes_cte = (
            select(models.Like.post_id.label("post_id"))
            .where(models.Like.user_id == -1)
            .cte("user_likes_cte")
        )

    results = db.query(
        models.Post,
        func.coalesce(likes_cte.c.likes, 0).label("likes"),
        func.coalesce(reposts_cte.c.reposts, 0).label("reposts"),
        (user_likes_cte.c.post_id != None).label("liked_by_user")
    ).outerjoin(
        likes_cte, likes_cte.c.post_id == models.Post.id
    ).outerjoin(
        reposts_cte, reposts_cte.c.post_id == models.Post.id
    ).outerjoin(
        user_likes_cte, user_likes_cte.c.post_id == models.Post.id
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
def get_posts_by_user(username: str, db: Session = Depends(get_db), current_user: models.User = Depends(oauth2.get_current_user)):

    profile_user = db.query(models.User).filter(models.User.username == username).first()
    if not profile_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"User with username: {username} does not exist")
    
    likes_cte = (
        select(models.Like.post_id, func.count(models.Like.user_id).label("likes"))
        .group_by(models.Like.post_id)
        .cte("likes_cte")
    )
    reposts_cte = (
        select(models.Repost.post_id, func.count(models.Repost.user_id).label("reposts"))
        .group_by(models.Repost.post_id)
        .cte("reposts_cte")
    )
    user_likes_cte = (
        select(models.Like.post_id.label("post_id"))
        .where(models.Like.user_id == current_user.id)
        .cte("user_likes_cte")
    )

    results = db.query(
        models.Post,
        func.coalesce(likes_cte.c.likes, 0).label("likes"),
        func.coalesce(reposts_cte.c.reposts, 0).label("reposts"),
        (user_likes_cte.c.post_id != None).label("liked_by_user")
    ).outerjoin(
        likes_cte, likes_cte.c.post_id == models.Post.id
    ).outerjoin(
        reposts_cte, reposts_cte.c.post_id == models.Post.id
    ).outerjoin(
        user_likes_cte, user_likes_cte.c.post_id == models.Post.id
    ).options(
        joinedload(models.Post.owner)
    ).filter(
        models.Post.owner_id == profile_user.id
    ).all()

    return results
