from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database import get_db

from app.auth.roles import sysadmin_required
from app.auth.roles import platform_required
from app.auth.security import get_password_hash

from app.models.ticket import Ticket
from app.models.equipment import Equipment

from app.models.user import User
from app.models.company import Company
from app.models.support_company_assignment import SupportCompanyAssignment
from app.schemas.platform_user import (
    UserCompanyAssignment,
    PlatformUserUpdate
)

from app.models.branch import Branch

router = APIRouter(tags=["Platform Users"])

@router.get("/platform/users")
def get_platform_users(

    db: Session = Depends(get_db),
    current_user = Depends(sysadmin_required)

):

    users = db.query(User).filter(
        User.is_platform_user == True
    ).all()

    result = []

    for user in users:

        result.append({

            "id": user.id,

            "full_name": user.full_name,

            "email": user.email,

            "phone": user.phone,

            "role": user.role,

            "is_active": user.is_active

        })

    return result

@router.get("/platform/users/{user_id}")
def get_platform_user(

    user_id: int,

    db: Session = Depends(get_db),
    current_user = Depends(sysadmin_required)

):

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:

        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )

    assignments = db.query(
        SupportCompanyAssignment
    ).filter(
        SupportCompanyAssignment.user_id == user_id
    ).all()

    company_ids = [

        item.company_id

        for item in assignments

    ]

    return {

        "id": user.id,

        "first_name": user.first_name,

        "last_name": user.last_name,

        "full_name": user.full_name,

        "email": user.email,

        "phone": user.phone,

        "role": user.role,

        "is_active": user.is_active,

        "assigned_companies": company_ids

    }

@router.get("/platform/companies/simple")
def get_companies_simple(

    db: Session = Depends(get_db),
    current_user = Depends(sysadmin_required)

):

    companies = db.query(
        Company
    ).all()

    return [

        {

            "id": company.id,

            "name": company.name

        }

        for company in companies

    ]

@router.put("/platform/users/{user_id}/companies")
def assign_companies(

    user_id: int,

    payload: UserCompanyAssignment,

    db: Session = Depends(get_db),

    current_user = Depends(sysadmin_required)

):

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:

        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )

    db.query(
        SupportCompanyAssignment
    ).filter(

        SupportCompanyAssignment.user_id == user_id

    ).delete()

    db.commit()

    for company_id in payload.company_ids:

        assignment = SupportCompanyAssignment(

            user_id=user_id,

            company_id=company_id

        )

        db.add(assignment)

    db.commit()

    return {

        "message": "Empresas asignadas correctamente"

    }

@router.put("/platform/users/{user_id}")
def update_platform_user(

    user_id: int,

    payload: PlatformUserUpdate,

    db: Session = Depends(get_db),

    current_user = Depends(sysadmin_required)

):

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:

        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )

    user.first_name = payload.first_name

    user.last_name = payload.last_name

    user.email = payload.email

    user.phone = payload.phone

    user.role = payload.role

    if payload.password:

        print(payload.model_dump())
        user.password = get_password_hash(
            payload.password
        )

    db.commit()

    return {

        "message": "Funcionario actualizado correctamente"

    }

@router.get("/platform/profile")
def get_my_profile(

    db: Session = Depends(get_db),

    current_user = Depends(platform_required)

):

    assignments = db.query(
        SupportCompanyAssignment
    ).filter(

        SupportCompanyAssignment.user_id
        == current_user.id

    ).all()

    company_ids = [

        item.company_id

        for item in assignments

    ]

    companies = db.query(
        Company
    ).filter(

        Company.id.in_(company_ids)

    ).all()

    assigned_companies_count = len(companies)

    open_tickets = db.query(
        Ticket
    ).filter(

        Ticket.assigned_to == current_user.id,

        Ticket.status == "OPEN"

    ).count()
    
    closed_tickets = db.query(
        Ticket
    ).filter(

        Ticket.assigned_to == current_user.id,

        Ticket.status == "CLOSED"

    ).count()

    in_progress_tickets = db.query(
        Ticket
    ).filter(

        Ticket.assigned_to == current_user.id,

        Ticket.status == "IN_PROGRESS"

    ).count()

    total_tickets = db.query(
        Ticket
    ).filter(

        Ticket.assigned_to == current_user.id

    ).count()

    managed_equipments = db.query(
        Equipment
    ).filter(

        Equipment.company_id.in_(company_ids)

    ).count()

    active_equipments = db.query(
        Equipment
    ).filter(

        Equipment.company_id.in_(company_ids),

        Equipment.is_active == True

    ).count()

    inactive_equipments = db.query(
        Equipment
    ).filter(

        Equipment.company_id.in_(company_ids),

        Equipment.is_active == False

    ).count()

    total_branches = db.query(
        Branch
    ).filter(

        Branch.company_id.in_(company_ids)

    ).count()

    return {

        "id": current_user.id,

        "full_name": current_user.full_name,

        "first_name": current_user.first_name,

        "last_name": current_user.last_name,

        "email": current_user.email,
        
        "phone": current_user.phone,

        "role": current_user.role,

        "is_active": current_user.is_active,

        "companies": [

                {
                    "id": company.id,
                    "name": company.name,

                    "branches": db.query(Branch).filter(
                        Branch.company_id == company.id
                    ).count(),

                    "equipments": db.query(Equipment).filter(
                        Equipment.company_id == company.id
                    ).count(),

                    "active_equipments": db.query(Equipment).filter(
                        Equipment.company_id == company.id,
                        Equipment.is_active == True
                    ).count(),

                    "inactive_equipments": db.query(Equipment).filter(
                        Equipment.company_id == company.id,
                        Equipment.is_active == False
                    ).count()
                }

            for company in companies

        ],
        "stats": {

            "companies":
                assigned_companies_count,

            "branches":
                total_branches,

            "equipments":
                managed_equipments,

            "active_equipments":
                active_equipments,

            "inactive_equipments":
                inactive_equipments,

            "total_tickets":
                total_tickets,

            "open_tickets":
                open_tickets,

            "in_progress_tickets":
                in_progress_tickets,

            "closed_tickets":
                closed_tickets

        },

    }

@router.get("/platform/support-users")
def get_support_users(

    db: Session = Depends(get_db),
    current_user = Depends(sysadmin_required)

):

    users = db.query(User).filter(

        User.role == "support",

        User.is_active == True

    ).all()

    return [

        {

            "id": user.id,

            "full_name": user.full_name,

            "email": user.email,

            "phone": user.phone

        }

        for user in users

    ]

@router.get("/platform/my-tickets")
def get_my_tickets(

    db: Session = Depends(get_db),

    current_user = Depends(platform_required)

):

    tickets = db.query(
        Ticket
    ).filter(
        Ticket.assigned_to == current_user.id
    ).all()

    return [

        {

            "id": ticket.id,

            "title": ticket.title,

            "company_name": (
                ticket.company.name
                if ticket.company
                else "-"
            ),

            "status": ticket.status,

            "priority": ticket.priority,

            "created_at": ticket.created_at

        }

        for ticket in tickets

    ]

