from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth.security import get_current_user
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

    return notifications

@router.patch("/notifications/{notification_id}/read")
def mark_notification_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    notification = db.query(
        Notification
    ).filter(
        Notification.id == notification_id
    ).first()

    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notificación no encontrada"
        )

    notification.is_read = True

    db.commit()

    return {"message": "Notificación marcada como leída"}

@router.patch("/notifications/read-all")
def read_all_notifications(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    db.query(Notification).filter(
        Notification.is_read == False
    ).update(
        {"is_read": True}
    )

    db.commit()

    return {"message": "Todas las notificaciones han sido marcadas como leídas"}
