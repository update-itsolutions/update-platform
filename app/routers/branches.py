from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal

from app.models.branch import Branch
from app.models.company import Company

from app.schemas.branch import (
    BranchCreate,
    BranchUpdate
)

from app.auth.roles import platform_required
from app.auth.security import get_current_user

router = APIRouter()


# DB CONNECTION
def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# CREATE BRANCH
@router.post("/branches/")
def create_branch(

    branch: BranchCreate,

    db: Session = Depends(get_db),

    current_user = Depends(platform_required)

):

    company = db.query(Company).filter(
        Company.id == branch.company_id
    ).first()

    if not company:

        raise HTTPException(
            status_code=404,
            detail="Empresa no encontrada"
        )

    existing_branch = db.query(Branch).filter(
        Branch.name == branch.name,
        Branch.company_id == branch.company_id
    ).first()

    if existing_branch:

        raise HTTPException(
            status_code=400,
            detail="La sucursal ya existe"
        )

    new_branch = Branch(

        name=branch.name,

        address=branch.address,

        city=branch.city,

        province=branch.province,

        company_id=branch.company_id

    )

    db.add(new_branch)

    db.commit()

    db.refresh(new_branch)

    return {

        "message": "Sucursal creada",

        "branch_id": new_branch.id,

        "company_id": new_branch.company_id

    }


# GET BRANCHES
@router.get("/branches/")
def get_branches(

    db: Session = Depends(get_db),

    current_user = Depends(platform_required)

):

    branches = db.query(Branch).all()

    return [

        {

            "id": branch.id,

            "name": branch.name,

            "address": branch.address,

            "city": branch.city,

            "province": branch.province,

            "company_id": branch.company_id

        }

        for branch in branches

    ]


# GET BRANCHES BY COMPANY
@router.get("/branches/company/{company_id}")
def get_company_branches(

    company_id: int,

    db: Session = Depends(get_db),

    current_user = Depends(platform_required)

):

    branches = db.query(Branch).filter(
        Branch.company_id == company_id
    ).all()

    return [

        {

            "id": branch.id,

            "name": branch.name,

            "address": branch.address

        }

        for branch in branches

    ]

# GET BRANCH ID

@router.get("/branches/{branch_id}")
def get_branch(

    branch_id: int,

    db: Session = Depends(get_db),

    current_user = Depends(platform_required)

):

    branch = db.query(Branch).filter(
        Branch.id == branch_id
    ).first()

    if not branch:

        raise HTTPException(
            status_code=404,
            detail="Sucursal no encontrada"
        )

    return {

        "id": branch.id,

        "name": branch.name,

        "address": branch.address,

        "city": branch.city,

        "province": branch.province,

        "company_id": branch.company_id

    }

# UPDATE BRANCH

@router.put("/branches/{branch_id}")
def update_branch(

    branch_id: int,

    branch_data: BranchUpdate,

    db: Session = Depends(get_db),

    current_user = Depends(platform_required)

):

    branch = db.query(Branch).filter(
        Branch.id == branch_id
    ).first()

    if not branch:

        raise HTTPException(
            status_code=404,
            detail="Sucursal no encontrada"
        )

    branch.name = branch_data.name
    branch.address = branch_data.address
    branch.city = branch_data.city
    branch.province = branch_data.province

    db.commit()

    db.refresh(branch)

    return {

        "message": "Sucursal actualizada",

        "branch_id": branch.id

    }
