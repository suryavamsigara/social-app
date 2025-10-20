from fastapi import Response, status, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
from sqlalchemy import func, select
from sqlalchemy.orm import joinedload
from typing import List, Optional
from .. import models, schemas, oauth2
from ..database import get_db
from ..vector.posts_recommendation import index_single_post, recommend_posts, index_posts_in_vector_db

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

    results = (
        db.query(
            models.Post,
            func.coalesce(likes_cte.c.likes, 0).label("likes"),
            func.coalesce(reposts_cte.c.reposts, 0).label("reposts"),
            (user_likes_cte.c.post_id != None).label("liked_by_user")
        )
        .outerjoin(likes_cte, likes_cte.c.post_id == models.Post.id)
        .outerjoin(reposts_cte, reposts_cte.c.post_id == models.Post.id)
        .outerjoin(user_likes_cte, user_likes_cte.c.post_id == models.Post.id)
        .options(joinedload(models.Post.owner))
        .all()
    )

    return results

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.Post)
def create_posts(post: schemas.PostCreate, db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)):
    new_post = models.Post(owner_id=current_user.id, **post.model_dump())
    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    try:
        index_single_post(post=new_post, db=db)
        print(f"Indexed new post with post id: {new_post.id}")
    except Exception as e:
        print(f"Failed to index post with id: {new_post.id} - {e}")

    return new_post

@router.delete("/delete/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(id: int, db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)):
    post_query = db.query(models.Post).filter(models.Post.id == id)
    post = post_query.first()
    if post == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Post with id: {id} doesn't exist")
    
    if post.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"You can't perform this action")
    post_query.delete(synchronize_session=False)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)

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

@router.get("/post/{post_id}", response_model=schemas.PostOut)
def get_post(post_id: str, db: Session = Depends(get_db), current_user: Optional[models.User] = Depends(oauth2.get_current_user_optional)):
    post_id = int(post_id)

    post = db.query(models.Post).filter(models.Post.id == post_id).first()

    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Post with id: {post_id} doesn't exist")
    
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

    result = db.query(
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
        models.Post.id == post_id
    ).first()
    
    return result

@router.post("/index")
def index_all_posts(db: Session = Depends(get_db)):
    result = index_posts_in_vector_db(db)
    return result

@router.get("/recommend", response_model=List[schemas.PostOut])
def recommend(query: str, db: Session = Depends(get_db), current_user: Optional[models.User] = Depends(oauth2.get_current_user_optional)):
    recommended_posts = recommend_posts(db, query)
    if not recommended_posts:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No similar posts found")
    
    recommended_posts_ids = [post.id for post in recommended_posts]

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

    results = (
        db.query(
            models.Post,
            func.coalesce(likes_cte.c.likes, 0).label("likes"),
            func.coalesce(reposts_cte.c.reposts, 0).label("reposts"),
            (user_likes_cte.c.post_id != None).label("liked_by_user")
        )
        .outerjoin(likes_cte, likes_cte.c.post_id == models.Post.id)
        .outerjoin(reposts_cte, reposts_cte.c.post_id == models.Post.id)
        .outerjoin(user_likes_cte, user_likes_cte.c.post_id == models.Post.id)
        .options(joinedload(models.Post.owner))
        .filter(models.Post.id.in_(recommended_posts_ids))
        .all()
    )

    return results