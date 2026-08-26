from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import case

from app.database import SessionLocal

from app.models.ticket import Ticket
from app.models.ticket_comment import TicketComment

from app.models.equipment import Equipment
from app.models.equipment_history import EquipmentHistory

from app.models.user import User
from app.schemas import ticket
from app.schemas.ticket import TicketCreate
from app.schemas.ticket_comment import (
    TicketCommentCreate
)

from datetime import datetime, UTC
from zoneinfo import ZoneInfo

from app.auth.roles import sysadmin_required

from app.auth.security import get_current_user
from pydantic import BaseModel

class TicketStatusUpdate(BaseModel):
    status: str

router = APIRouter()


# DB CONNECTION

def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# CREATE TICKET
@router.post("/tickets")
def create_ticket(

    ticket: TicketCreate,

    db: Session = Depends(get_db),

    current_user = Depends(get_current_user)

):

    equipment = db.query(
        Equipment
    ).filter(
        Equipment.id == ticket.equipment_id
    ).first()

    if not equipment:

        raise HTTPException(
            status_code=404,
            detail="Equipo no encontrado"
        )

    new_ticket = Ticket(

        title=ticket.title,

        description=ticket.description,

        priority=ticket.priority,

        equipment_id=ticket.equipment_id,

        company_id=equipment.company_id,

        created_by=current_user.id

    )

    db.add(new_ticket)

    db.commit()

    db.refresh(new_ticket)

    history = EquipmentHistory(

        equipment_id=ticket.equipment_id,

        description=(
            f"{current_user.full_name} creó el ticket "
            f"#{new_ticket.id}"
        )

    )

    db.add(history)

    db.commit()

    return {

        "message": "Ticket creado",

        "ticket_id": new_ticket.id

    }

#GET TICKET DETAIL
@router.get("/tickets/{ticket_id}")
def get_ticket_detail(

    ticket_id: int,

    db: Session = Depends(get_db),

    current_user = Depends(get_current_user)

):

    ticket = db.query(
        Ticket
    ).filter(
        Ticket.id == ticket_id
    ).first()

    if not ticket:

        raise HTTPException(
            status_code=404,
            detail="Ticket no encontrado"
        )

    return {

        "id": ticket.id,

        "company_id": ticket.company_id,

        "title": ticket.title,

        "description": ticket.description,

        "status": ticket.status,

        "priority": ticket.priority,

        "created_at": ticket.created_at.isoformat() if ticket.created_at else None,

        "created_by_name": (

            ticket.creator.full_name

            if ticket.creator

            else "Sin Usuario"

        ),

        "equipment_id": (

            ticket.equipment.id

            if ticket.equipment

            else None

        ),

        "equipment_name": (

            ticket.equipment.hostname

            if ticket.equipment

            else "Sin Equipo"

        ),

        "company_name": (
          ticket.company.name
          if ticket.company
          else "Sin Empresa"
        ),

        "branch_name": (

            ticket.equipment.branch.name

            if ticket.equipment

            and ticket.equipment.branch

            else "Sin Sucursal"

        ),

        "updated_at": ticket.updated_at.isoformat() if ticket.updated_at else None,

        "updated_by_name": (
            ticket.updater.full_name
            if ticket.updater
            else None
        ),

        "assigned_to": ticket.assigned_to,

        "assigned_user": (

            ticket.assignee.full_name

            if ticket.assignee

            else None

        )

    }

# TICKET STATUS
@router.patch("/tickets/{ticket_id}/status")
def update_ticket_status(

    ticket_id: int,

    data: TicketStatusUpdate,

    db: Session = Depends(get_db),

    current_user = Depends(get_current_user)

):

    ticket = db.query(
        Ticket
    ).filter(
        Ticket.id == ticket_id
    ).first()

    if not ticket:

        raise HTTPException(
            status_code=404,
            detail="Ticket no encontrado"
        )

    old_status = ticket.status

    status_labels = {
        "OPEN": "Abierto",
        "IN_PROGRESS": "En Progreso",
        "CLOSED": "Cerrado"
    }

    ticket.status = data.status
    ticket.updated_at = datetime.now(UTC)
    ticket.updated_by = current_user.id

    db.commit()

    history = EquipmentHistory(

        equipment_id=ticket.equipment_id,

        description=(
            f"{current_user.full_name} cambió estado "
            f"del ticket #{ticket.id} "
            f"de {status_labels.get(old_status, old_status)}"
            f" a {status_labels.get(ticket.status, ticket.status)}"
        )

    )

    db.add(history)

    db.commit()

    return {
        "message": "Estado actualizado"
    }

# CREAR COMENTARIO EN TICKET
@router.post(
    "/tickets/{ticket_id}/comments"
)
def create_comment(

    ticket_id: int,

    data: TicketCommentCreate,

    db: Session = Depends(get_db),

    current_user = Depends(get_current_user)

):

    comment = TicketComment(

        ticket_id=ticket_id,

        user_id=current_user.id,

        comment=data.comment

    )

    db.add(comment)

    db.commit()

    ticket = db.query(
        Ticket
    ).filter(
        Ticket.id == ticket_id
    ).first()

    ticket.updated_at = datetime.now(UTC)
    ticket.updated_by = current_user.id

    db.commit()

    history = EquipmentHistory(
        equipment_id=ticket.equipment_id,
        description=(
            f"{current_user.full_name} agregó "
            f"un comentario al ticket #{ticket.id}"
        )
    )

    db.add(history)

    db.commit()

    return {
        "message": "Comentario agregado"
    }

# OBTENER COMENTARIO
@router.get(
    "/tickets/{ticket_id}/comments"
)
def get_comments(

    ticket_id: int,

    db: Session = Depends(get_db),

    current_user = Depends(get_current_user)

):

    comments = db.query(
        TicketComment
    ).filter(
        TicketComment.ticket_id == ticket_id
    ).order_by(
        TicketComment.created_at.desc()
    ).all()

    result = []

    for item in comments:

        result.append({

            "id": item.id,

            "comment": item.comment,

            "created_at": item.created_at.isoformat() if item.created_at else None,

            "user_name": (
                item.user.full_name
                if item.user
                else "Usuario"
            )

        })

    return result

# PLATFORM TICKETS
@router.get("/platform/tickets")
def get_all_tickets(

    db: Session = Depends(get_db),

    current_user = Depends(get_current_user)

):

    tickets = db.query(
        Ticket
    ).order_by(
        Ticket.created_at.desc()
    ).all()

    result = []

    for ticket in tickets:

        result.append({

            "id": ticket.id,

            "title": ticket.title,

            "status": ticket.status,

            "priority": ticket.priority,

            "created_at": ticket.created_at.isoformat() if ticket.created_at else None,

            "created_by_name": (
                ticket.creator.full_name
                if ticket.creator
                else "Sin Usuario"
            ),

            "equipment_name": (
                ticket.equipment.hostname
                if ticket.equipment
                else "Sin Equipo"
            ),

            "company_name": (
                ticket.company.name
                if ticket.company
                else "Sin Empresa"
            ),

            "assigned_to": ticket.assigned_to,

            "assigned_user": (
                ticket.assignee.full_name
                if ticket.assignee
                else None
            ),

            "updated_at": ticket.updated_at.isoformat() if ticket.updated_at else None,

            "updated_by_name": (
                ticket.updater.full_name
                if ticket.updater
                else "-"
            )

        })

    return result

# COMPANIES TICKETS
@router.get(
    "/companies/{company_id}/tickets"
)
def get_company_tickets(

    company_id: int,

    db: Session = Depends(get_db),

    current_user = Depends(get_current_user)

):

    tickets = db.query(
        Ticket
    ).filter(
        Ticket.company_id == company_id
    ).order_by(
        Ticket.created_at.desc()
    ).all()

    result = []

    for ticket in tickets:

        result.append({

            "id": ticket.id,

            "title": ticket.title,

            "description": ticket.description,

            "priority": ticket.priority,

            "status": ticket.status,

            "created_at": ticket.created_at.isoformat() if ticket.created_at else None,

            "equipment_name": (
                ticket.equipment.hostname
                if ticket.equipment
                else "Sin Equipo"
            ),

            "created_by_name": (
                ticket.creator.full_name
                if ticket.creator
                else "Sin Usuario"
            )

        })

    return result

# ASSIGN TICKET
@router.patch("/tickets/{ticket_id}/assign")
def assign_ticket(

    ticket_id: int,

    payload: dict,

    db: Session = Depends(get_db),

    current_user = Depends(sysadmin_required)

):

    ticket = db.query(
        Ticket
    ).filter(
        Ticket.id == ticket_id
    ).first()

    if not ticket:

        raise HTTPException(

            status_code=404,

            detail="Ticket no encontrado"

        )

    ticket.assigned_to = payload["user_id"]
    ticket.updated_at = datetime.now(UTC)
    ticket.updated_by = current_user.id

    db.commit()

    assigned_user = db.query(
        User
    ).filter(
        User.id == payload["user_id"]
    ).first()

    history = EquipmentHistory(
        equipment_id=ticket.equipment_id,
        description=(
            f"{current_user.full_name} asignó el ticket "
            f"#{ticket.id} a "
            f"{assigned_user.full_name}"
        )
    )

    db.add(history)

    db.commit()

    db.refresh(ticket)

    return {

        "message":
            "Técnico asignado correctamente",

        "assigned_to":
            ticket.assigned_to

    }

# COMPANY TICKETS
@router.get("/company/tickets")
def get_company_tickets(

    current_user=Depends(get_current_user),

    db: Session = Depends(get_db)

):

    tickets = db.query(
        Ticket
    ).filter(
        Ticket.company_id == current_user.company_id
    ).order_by(
        Ticket.created_at.desc()
    ).all()

    return [

        {

            "id": ticket.id,

            "title": ticket.title,

            "status": ticket.status,

            "priority": ticket.priority,

            "created_at": ticket.created_at.isoformat() if ticket.created_at else None,

            "created_by_name": (
                ticket.creator.full_name
                if ticket.creator
                else "Sin Usuario"
            ),

            "equipment_name": (
                ticket.equipment.hostname
                if ticket.equipment
                else "Sin Equipo"
            ),

            "branch_name": (
                ticket.equipment.branch.name
                if ticket.equipment
                and ticket.equipment.branch
                else "Sin Sucursal"
            ),

            "assigned_user": (
                ticket.assignee.full_name
                if ticket.assignee
                else None
            ),

            "assigned_to": ticket.assigned_to,

            "updated_at": ticket.updated_at.isoformat() if ticket.updated_at else None,

            "updated_by_name": (
                ticket.updater.full_name
                if ticket.updater
                else "-"
            )

        }

        for ticket in tickets

    ]

# GET COMPANY EQUIPMENTS
@router.get("/company/equipments")
def get_company_equipments(

    db: Session = Depends(get_db),

    current_user = Depends(get_current_user)

):

    equipments = db.query(
        Equipment
    ).filter(
        Equipment.company_id == current_user.company_id
    ).all()

    result = []

    for eq in equipments:

        result.append({

            "id": eq.id,

            "hostname": eq.hostname,

            "asset_tag": eq.asset_tag,

            "branch_name": (
                eq.branch.name
                if eq.branch
                else "Sin sucursal"
            ),

            "is_online": eq.is_online,

            "is_active": eq.is_active

        })

    return result

# GET TICKETS BY EQUIPMENT
@router.get("/equipments/{equipment_id}/tickets")
def get_equipment_tickets(

    equipment_id: int,

    db: Session = Depends(get_db),

    current_user = Depends(get_current_user)

):

    tickets = db.query(
        Ticket
    ).filter(
        Ticket.equipment_id == equipment_id
    ).order_by(

        case(

            (Ticket.status == "OPEN", 1),

            (Ticket.status == "IN_PROGRESS", 2),

            (Ticket.status == "CLOSED", 3),

            else_=4

        ),

        Ticket.created_at.desc()

    ).all()

    result = []

    for ticket in tickets:

        result.append({

            "id": ticket.id,

            "title": ticket.title,

            "description": ticket.description,

            "priority": ticket.priority,

            "status": ticket.status,

            "created_at": ticket.created_at.isoformat() if ticket.created_at else None,

            "updated_at": ticket.updated_at.isoformat() if ticket.updated_at else None,

            "created_by_name": (
                ticket.creator.full_name
                if ticket.creator
                else "Sin Usuario"
            ),

            "assigned_to": ticket.assigned_to,

            "assigned_user": (

                ticket.assignee.full_name

                if ticket.assignee

                else None

            )

        })

    return result

