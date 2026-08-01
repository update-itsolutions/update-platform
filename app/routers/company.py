from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal

from app.auth.security import get_current_user

from app.models.branch import Branch
from app.models.equipment import Equipment
from app.models.ticket import Ticket
from app.models.user import User

router = APIRouter()


# DB CONNECTION

def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# COMPANY DASHBOARD

@router.get("/company/dashboard")
def company_dashboard(

    current_user=Depends(get_current_user),

    db: Session = Depends(get_db)

):

    company_id = current_user.company_id

    # ======================
    # KPIs PRINCIPALES
    # ======================

    total_equipments = db.query(
        Equipment
    ).filter(
        Equipment.company_id == company_id
    ).count()

    online_equipments = db.query(
        Equipment
    ).filter(
        Equipment.company_id == company_id,
        Equipment.is_online == True
    ).count()

    offline_equipments = db.query(
        Equipment
    ).filter(
        Equipment.company_id == company_id,
        Equipment.is_online == False
    ).count()

    total_users = db.query(
        User
    ).filter(
        User.company_id == company_id
    ).count()

    total_branches = db.query(
        Branch
    ).filter(
        Branch.company_id == company_id
    ).count()

    active_equipments = db.query(
        Equipment
    ).filter(
        Equipment.company_id == company_id,
        Equipment.is_active == True
    ).count()

    inactive_equipments = db.query(
        Equipment
    ).filter(
        Equipment.company_id == company_id,
        Equipment.is_active == False
    ).count()

    availability = 0

    if active_equipments > 0:

        availability = round(
            (online_equipments / active_equipments) * 100,
            1
        )

    # ======================
    # EQUIPOS POR SUCURSAL
    # ======================

    branches_stats = []

    branches = db.query(
        Branch
    ).filter(
        Branch.company_id == company_id
    ).all()

    for branch in branches:

        equipments_count = db.query(
            Equipment
        ).filter(
            Equipment.branch_id == branch.id
        ).count()

        branches_stats.append({

            "branch_name": branch.name,

            "equipments": equipments_count

        })

    # ======================
    # SISTEMAS OPERATIVOS
    # ======================

    os_stats = {}

    equipments = db.query(
        Equipment
    ).filter(
        Equipment.company_id == company_id
    ).all()

    for eq in equipments:

        os_name = eq.operating_system or "Sin Datos"

        os_stats[os_name] = (

            os_stats.get(os_name, 0) + 1

        )

    # ======================
    # ULTIMOS EQUIPOS
    # ======================

    latest_equipments_query = db.query(
        Equipment
    ).filter(
        Equipment.company_id == company_id
    ).order_by(
        Equipment.last_seen.desc()
    ).limit(5).all()

    latest_equipments = [

        {

            "hostname": eq.hostname,

            "last_seen": eq.last_seen,

            "branch": (
                eq.branch.name
                if eq.branch
                else "Sin sucursal"
            )

        }

        for eq in latest_equipments_query

    ]
    
    # ======================
    # TICKETS
    # ======================

    total_tickets = db.query(
        Ticket
    ).filter(
        Ticket.company_id == company_id
    ).count()

    open_tickets = db.query(
        Ticket
    ).filter(
        Ticket.company_id == company_id,
        Ticket.status == "OPEN"
    ).count()

    in_progress_tickets = db.query(
        Ticket
    ).filter(
        Ticket.company_id == company_id,
        Ticket.status == "IN_PROGRESS"
    ).count()

    closed_tickets = db.query(
        Ticket
    ).filter(
        Ticket.company_id == company_id,
        Ticket.status == "CLOSED"
    ).count()

    # ALERTAS (por ahora usamos offline)

    alerts = offline_equipments

    # ======================
    # RESPONSE
    # ======================

    return {

        "total_equipments": total_equipments,
        "active_equipments": active_equipments,
        "inactive_equipments": inactive_equipments,
        "online_equipments": online_equipments,
        "offline_equipments": offline_equipments,

        "tickets": total_tickets,
        "open_tickets": open_tickets,
        "in_progress_tickets": in_progress_tickets,
        "closed_tickets": closed_tickets,
        "alerts": alerts,

        "availability": availability,

        "total_users": total_users,
        "total_branches": total_branches,

        "branches_stats": branches_stats,
        "os_stats": os_stats,
        "latest_equipments": latest_equipments

    }

