from fastapi import status, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
from .. import schemas, database, models, oauth2

router = APIRouter(
    prefix="/repost",
    tags=['Repost']
)

@router.post("/", status_code=status.HTTP_201_CREATED)
def repost(repost: schemas.Repost, db: Session = Depends(database.get_db), current_user: int = Depends(oauth2.get_current_user)):
    post = db.query(models.Post).filter(models.Post.id == repost.post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Post with id: {repost.post_id} doesn't exist")
    repost_query = db.query(models.Repost).filter(models.Repost.post_id == repost.post_id, models.Repost.user_id == current_user.id)
    found_repost = repost_query.first()

    if (repost.dir == 1):
        if found_repost:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"User {current_user.id} has already reposted {repost.post_id}")
        
        new_repost = models.Repost(post_id = repost.post_id, user_id = current_user.id)
        db.add(new_repost)
        db.commit()
        return {"message": "successfully added repost"}
