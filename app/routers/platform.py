from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session

from app.database import SessionLocal

from app.models.company import Company
from app.models.equipment import Equipment
from app.models.branch import Branch
from app.models.ticket import Ticket

from app.auth.security import get_current_user
from app.schemas.company import CompanyCreate
from app.schemas.user import CreateUserByAdmin
from app.schemas.platform_user import (
    UserCompanyAssignment,
    PlatformUserUpdate,
    PlatformUserStatusUpdate
)

from app.models.user import User
from app.auth.security import hash_password
from app.auth.roles import sysadmin_required

from app.auth.constants import (
    ROLE_SYSADMIN,
    ROLE_SUPPORT
)

router = APIRouter()

#DB CONNECTION
def get_db():

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

#VERIFY PLATFORM USER
def platform_required(

    current_user = Depends(get_current_user)

):

    if not current_user.is_platform_user:
        raise HTTPException(
            status_code=403,
            detail="Acceso denegado"
        )
    return current_user

# PLATFORM STATS
@router.get("/platform/stats")
def get_platform_stats(

    db: Session = Depends(get_db),
    current_user = Depends(platform_required)

):

    total_tickets = db.query(
        Ticket
    ).count()

    open_tickets = db.query(
        Ticket
    ).filter(
        Ticket.status == "OPEN"
    ).count()

    closed_tickets = db.query(
        Ticket
    ).filter(
        Ticket.status == "CLOSED"
    ).count()

    in_progress_tickets = db.query(
        Ticket
    ).filter(
        Ticket.status == "IN_PROGRESS"
    ).count()

    alerts = (

        db.query(Equipment)
        .filter(
            Equipment.is_online == False
        )
        .count()

    )

    return {

        "companies":
            db.query(Company).count(),

        "users":
            db.query(User).count(),

        "equipments":
            db.query(Equipment).count(),

        "branches":
            db.query(Branch).count(),

        "tickets":
            total_tickets,

        "tickets_open":
            open_tickets,

        "tickets_closed":
            closed_tickets,

        "tickets_in_progress":
            in_progress_tickets,
            
        "alerts":
            alerts

    }

#GET ALL COMPANIES
@router.get("/platform/companies")
def get_platform_companies(

    current_user = Depends(platform_required),
    db: Session = Depends(get_db)

    ):

    companies = db.query(
        Company
    ).order_by(
        Company.id.desc()
    ).all()
    result = []
    for company in companies:
        total_users = db.query(User).filter(
            User.company_id == company.id
        ).count()
        total_equipments = db.query(Equipment).filter(
            Equipment.company_id == company.id
        ).count()
        total_branches = db.query(Branch).filter(
            Branch.company_id == company.id
        ).count()
        result.append({
            "company_id": company.id,
            "company_name": company.name,
            "total_users": total_users,
            "total_equipments": total_equipments,
            "total_branches": total_branches
        })
    return result

#COMPANY DETAIL
@router.get("/platform/company/{company_id}")
def get_company_detail(

    company_id: int,
    current_user = Depends(platform_required),
    db: Session = Depends(get_db)

    ):

    company = db.query(Company).filter(
        Company.id == company_id
    ).first()
    if not company:
        raise HTTPException(
            status_code=404,
            detail="Empresa no encontrada"
        )
    branches = db.query(Branch).filter(
        Branch.company_id == company_id
    ).all()
    users = db.query(User).filter(
        User.company_id == company_id
    ).all()
    equipments = db.query(Equipment).filter(
        Equipment.company_id == company_id
    ).all()
    return {
        "company": {
            "id": company.id,
            "name": company.name,
            "business_name": company.business_name,
            "tax_id": company.tax_id,
            "email": company.email,
            "phone": company.phone,
            "address": company.address,
            "city": company.city,
            "province": company.province,
            "country": company.country,
            "postal_code": company.postal_code,
            "website": company.website,
            "industry": company.industry,
            "notes": company.notes
        },
        "branches": [
            {
                "id": branch.id,
                "name": branch.name,
                "address": branch.address
            }
            for branch in branches
        ],
        "users": [
            {
                "id": user.id,
                "full_name": user.full_name,
                "email": user.email,
                "role": user.role,
                "is_active": user.is_active
            }
            for user in users
        ],
        "equipments": [
            {
                "id": eq.id,
                "hostname": eq.hostname,
                "ip_address": eq.ip_address,
                "operating_system": eq.operating_system,
                "logged_user": eq.logged_user,
                "is_online": eq.is_online,
                "is_active": eq.is_active,
                "branch_name": eq.branch.name if eq.branch else "Sin sucursal"
            }
            for eq in equipments
        ]
    }

#COMPANY CREATE
@router.post("/platform/companies/create")
def create_company(

    company: CompanyCreate,

    db: Session = Depends(get_db)

):

    new_company = Company(

        name=company.name,
        business_name=company.business_name,
        tax_id=company.tax_id,
        email=company.email,
        phone=company.phone,
        address=company.address,
        city=company.city,
        province=company.province,
        country=company.country,
        postal_code=company.postal_code,
        website=company.website,
        industry=company.industry,
        notes=company.notes

    )

    db.add(new_company)

    db.commit()

    db.refresh(new_company)

    return {
        "message": "Empresa creada",
        "company_id": new_company.id
    }

# COMPANY UPDATE
@router.put("/platform/company/{company_id}")
def update_company(

    company_id: int,

    company: CompanyCreate,

    db: Session = Depends(get_db),

    current_user = Depends(sysadmin_required)

):

    existing_company = db.query(
        Company
    ).filter(
        Company.id == company_id
    ).first()

    if not existing_company:

        raise HTTPException(
            status_code=404,
            detail="Empresa no encontrada"
        )

    existing_company.name = company.name
    existing_company.business_name = company.business_name
    existing_company.tax_id = company.tax_id
    existing_company.email = company.email
    existing_company.phone = company.phone
    existing_company.address = company.address
    existing_company.city = company.city
    existing_company.province = company.province
    existing_company.country = company.country
    existing_company.postal_code = company.postal_code
    existing_company.website = company.website
    existing_company.industry = company.industry
    existing_company.notes = company.notes

    db.commit()

    db.refresh(existing_company)

    return {

        "message": "Empresa actualizada",

        "company_id": existing_company.id

    }

# CREATE PLATFORM USER
@router.post("/users/create")
def create_platform_user(
    user_data: CreateUserByAdmin,
    current_user = Depends(sysadmin_required),
    db: Session = Depends(get_db)
):
    # VERIFY EMAIL
    existing_user = db.query(User).filter(
        User.email == user_data.email
    ).first()
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="El usuario ya existe"
        )
    # VERIFY ROLE
    allowed_roles = [
        ROLE_SYSADMIN,
        ROLE_SUPPORT
    ]
    if user_data.role not in allowed_roles:
        raise HTTPException(
            status_code=400,
            detail="Rol inválido"
        )
    # CREATE USER
    new_user = User(
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        email=user_data.email,
        password=hash_password(
            user_data.password
        ),
        role=user_data.role,
        is_platform_user=True,
        company_id=None
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {
        "message": "Usuario plataforma creado",
        "email": new_user.email,
        "role": new_user.role
    }

# ACTIVE/DESACTIVE USER PLATFORM
@router.patch("/platform/users/{user_id}/status")
def update_platform_user_status(

    user_id: int,

    payload: PlatformUserStatusUpdate,

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

    user.is_active = payload.is_active

    db.commit()

    return {

        "message": "Estado actualizado"

    }
