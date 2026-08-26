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

@router.get("/notifications")
def get_notifications(

    db: Session = Depends(get_db)

):

    notifications = db.query(
        Notification
    ).order_by(
        Notification.created_at.desc()
    ).limit(5).all()

    result = []

    for item in notifications:

        result.append({

            "id": item.id,

            "title": item.title,

            "message": item.message,

            "type": item.type,

            "is_read": item.is_read,

            "created_at": item.created_at.isoformat()
            if item.created_at
            else None

        })

    return result