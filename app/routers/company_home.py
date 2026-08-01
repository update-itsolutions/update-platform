from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.company import Company
from app.models.branch import Branch
from app.models.user import User
from app.models.equipment import Equipment

from app.auth.security import get_current_user

router = APIRouter(
    prefix="/company/home",
    tags=["Company Home"]
)

@router.get("/")
def company_home(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    company_id = current_user.company_id

    company = db.query(Company).filter(
        Company.id == company_id
    ).first()

    branches = db.query(Branch).filter(
        Branch.company_id == company_id
    ).all()

    users = db.query(User).filter(
        User.company_id == company_id
    ).all()

    equipments = db.query(Equipment).filter(
        Equipment.company_id == company_id
    ).all()

    total_users = len(users)

    total_branches = len(branches)

    total_equipments = len(equipments)

    online_equipments = len([
        eq for eq in equipments
        if eq.is_online
    ])

    offline_equipments = (
        total_equipments - online_equipments
    )

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
                "branch_name": (
                    eq.branch.name
                    if eq.branch
                    else "Sin sucursal"
                )
            }

            for eq in equipments

        ],

        "stats": {

            "branches": total_branches,
            "users": total_users,
            "equipments": total_equipments,
            "online": online_equipments,
            "offline": offline_equipments

        }

    }

