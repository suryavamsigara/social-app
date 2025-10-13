from fastapi import status, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
from .. import models, schemas, utils, oauth2
from ..database import get_db

router = APIRouter(
    prefix="/users",
    tags=['Users']
)

@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=schemas.Userout)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user_email = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user_email:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
    
    existing_user_username = db.query(models.User).filter(models.User.username == user.username).first()
    if existing_user_username:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username already taken")

    hashed_password = utils.hash(user.password)
    user.password = hashed_password

    new_user = models.User(**user.model_dump())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@router.get("/{username}", response_model=schemas.Userout)
def get_user_by_username(username: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == username).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with username: {username} does not exist")

    return user

@router.get("/myprofile/me", response_model=schemas.Userout)
def get_me(current_user: models.User = Depends(oauth2.get_current_user)):
    return current_user
