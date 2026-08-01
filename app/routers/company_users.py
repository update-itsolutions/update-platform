from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.company import Company

from app.schemas.user import CompanyUserCreate
from app.schemas.platform_user import UserCompanyAssignment

from app.auth.roles import user_management_required

from app.auth.security import get_password_hash

from app.auth.constants import (
    ROLE_ADMIN_EMPRESA,
    ROLE_SUPERVISOR,
    ROLE_VIEWER
)

router = APIRouter(
    prefix="/company/users",
    tags=["Company Users"]
)

@router.post("/create")
def create_company_user(
    user_data: CompanyUserCreate,
    db: Session = Depends(get_db),
    current_user=Depends(user_management_required)
):

    company = db.query(Company).filter(
        Company.id == user_data.company_id
    ).first()

    if not company:

        raise HTTPException(
            status_code=404,
            detail="Empresa no encontrada"
        )

    existing_user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="El email ya existe"
        )

    allowed_roles = [
        ROLE_ADMIN_EMPRESA,
        ROLE_SUPERVISOR,
        ROLE_VIEWER
    ]

    if user_data.role not in allowed_roles:

        raise HTTPException(
            status_code=400,
            detail="Rol inválido"
        )

    new_user = User(
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        email=user_data.email,
        password=get_password_hash(
            user_data.password
        ),
        role=user_data.role,
        company_id=user_data.company_id,
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return {
        "message": "Usuario creado correctamente",
        "user_id": new_user.id
    }