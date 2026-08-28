from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth.security import get_current_user
from app.database import SessionLocal

from app.models.notification import Notification
from app.models.support_company_assignment import SupportCompanyAssignment

router = APIRouter()


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


@router.get("/notifications/unread-count")
def get_unread_count(

    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)

):

    query = db.query(Notification).filter(
    Notification.is_read == False
    )

    # SysAdmin ve todo
    if current_user.role == "sysadmin":

        pass

    # Admin Empresa ve solo su empresa
    elif current_user.role in [
        "administrador",
        "supervisor"
    ]:
        query = query.filter(
            Notification.company_id ==
            current_user.company_id
        )
    
    # Support ve solo empresas asignadas
    elif current_user.role == "support":

        assignments = db.query(
            SupportCompanyAssignment
        ).filter(
            SupportCompanyAssignment.user_id == current_user.id
        ).all()

        company_ids = [
            item.company_id
            for item in assignments
        ]

        if not company_ids:

            return {"count": 0}

        query = query.filter(
            Notification.company_id.in_(company_ids)
        )

    count = query.count()

    return {
        "count": count
    }

@router.get("/notifications")
def get_notifications(

    db: Session = Depends(get_db),

    current_user = Depends(get_current_user)

):

    query = db.query(Notification)

    # SysAdmin
    if current_user.role == "sysadmin":

        pass

    # Admin Empresa
    elif current_user.role in [
        "administrador",
        "supervisor"
    ]:

        query = query.filter(
            Notification.company_id ==
            current_user.company_id
        )

    # Support
    elif current_user.role == "support":

        assignments = db.query(
            SupportCompanyAssignment
        ).filter(
            SupportCompanyAssignment.user_id == current_user.id
        ).all()

        company_ids = [
            item.company_id
            for item in assignments
        ]

        if not company_ids:

            return []

        query = query.filter(
            Notification.company_id.in_(company_ids)
        )

    notifications = query.order_by(
        Notification.created_at.desc()
    ).limit(50).all()

    return [

        {
            "id": item.id,
            "title": item.title,
            "message": item.message,
            "type": item.type,
            "is_read": item.is_read,
            "company_id": item.company_id,
            "created_at": item.created_at.isoformat()
            if item.created_at
            else None
        }

        for item in notifications

    ]

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

    if current_user.role != "sysadmin":

        if notification.company_id != current_user.company_id:

            raise HTTPException(
                status_code=403,
                detail="Permisos insuficientes"
            )

    notification.is_read = True

    db.commit()

    return {
        "message": "Notificación marcada como leída"
    }


@router.patch("/notifications/read-all")
def read_all_notifications(

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    query = db.query(Notification)

    if current_user.role != "sysadmin":

        query = query.filter(
            Notification.company_id ==
            current_user.company_id
        )

    query.filter(
        Notification.is_read == False
    ).update(
        {"is_read": True}
    )

    db.commit()

    return {
        "message": "Todas las notificaciones han sido marcadas como leídas"
    }

