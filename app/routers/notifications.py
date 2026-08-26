from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal

from app.models.notification import Notification

router = APIRouter()


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


@router.get("/notifications/unread-count")
def get_unread_count(

    db: Session = Depends(get_db)

):

    count = db.query(
        Notification
    ).filter(
        Notification.is_read == False
    ).count()

    return {
        "count": count
    }
