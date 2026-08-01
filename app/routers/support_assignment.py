from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.support_company_assignment import SupportCompanyAssignment

from app.schemas.support_company_assignment import AssignmentCreate

from app.auth.roles import sysadmin_required

router = APIRouter()


@router.post("/support-assignments")
def assign_companies(

    data: AssignmentCreate,

    db: Session = Depends(get_db),

    current_user = Depends(sysadmin_required)

):

    db.query(
        SupportCompanyAssignment
    ).filter(
        SupportCompanyAssignment.user_id == data.user_id
    ).delete()

    for company_id in data.company_ids:

        db.add(

            SupportCompanyAssignment(

                user_id=data.user_id,

                company_id=company_id

            )

        )

    db.commit()

    return {

        "message": "Empresas asignadas correctamente"

    }

@router.get("/support-assignments/{user_id}")
def get_assignments(

    user_id: int,

    db: Session = Depends(get_db),

    current_user = Depends(sysadmin_required)

):

    assignments = db.query(
        SupportCompanyAssignment
    ).filter(
        SupportCompanyAssignment.user_id == user_id
    ).all()

    return [

        assignment.company_id

        for assignment in assignments

    ]
