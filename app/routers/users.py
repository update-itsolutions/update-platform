from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm

from sqlalchemy.orm import Session

from app.database import SessionLocal

from app.models.user import User
from app.models.company import Company

from app.schemas.user import (
    PasswordUpdate,
    UserCreate,
    UserInternalCreate,
    PlatformUserCreate,
    UserUpdate,
    PasswordUpdate
)

from app.auth.security import (
    verify_password,
    create_access_token,
    hash_password,
    get_current_user
)

from app.auth.roles import management_required, user_management_required
from app.auth.roles import sysadmin_required

from app.auth.constants import (
    ROLE_ADMIN_EMPRESA,
    ROLE_SYSADMIN,
    ROLE_SUPPORT
)

router = APIRouter()


# DB CONNECTION
def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# REGISTER COMPANY + ADMIN
@router.post("/register")
def register(

    user: UserCreate,

    db: Session = Depends(get_db)

):

    # VERIFY COMPANY
    existing_company = db.query(Company).filter(
        Company.name == user.company_name
    ).first()

    if existing_company:

        raise HTTPException(
            status_code=400,
            detail="La empresa ya existe"
        )

    # VERIFY EMAIL
    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="El email ya está registrado"
        )

    # CREATE COMPANY
    new_company = Company(
        name=user.company_name
    )

    db.add(new_company)

    db.commit()

    db.refresh(new_company)

    # CREATE ADMIN
    new_user = User(

        first_name=user.first_name,

        last_name=user.last_name,

        email=user.email,

        password=hash_password(user.password),

        role=ROLE_ADMIN_EMPRESA,

        company_id=new_company.id,

        is_platform_user=False

    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return {

        "message": "Empresa registrada correctamente",

        "company_id": new_company.id,

        "user_id": new_user.id

    }

# LOGIN
@router.post("/login")
def login(

    form_data: OAuth2PasswordRequestForm = Depends(),

    db: Session = Depends(get_db)

):

    db_user = db.query(User).filter(
        User.email == form_data.username
    ).first()

    if not db_user:

        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )

    if not db_user.is_active:

        raise HTTPException(
            status_code=403,
            detail="Usuario desactivado"
        )

    if not verify_password(
        form_data.password,
        db_user.password
    ):

        raise HTTPException(
            status_code=401,
            detail="Contraseña incorrecta"
        )

    access_token = create_access_token(
        data={
            "sub": db_user.email,
            "role": db_user.role
        }
    )

    return {

        "access_token": access_token,
        "token_type": "bearer",

        "full_name": db_user.full_name,
        "email": db_user.email,
        "phone": db_user.phone,
        "role": db_user.role,

        "user": {
            "full_name": db_user.full_name,
            "email": db_user.email,
            "phone": db_user.phone,
            "role": db_user.role
        }

    }

# DESACTIVAR USUARIO
@router.put("/users/{user_id}/deactivate")
def deactivate_user(

    user_id: int,

    db: Session = Depends(get_db),

    current_user = Depends(management_required)

):

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:

        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )

    user.is_active = False

    db.commit()

    return {
        "message": "Usuario desactivado"
    }

# ACTIVAR USUARIO
@router.put("/users/{user_id}/activate")
def activate_user(

    user_id: int,

    db: Session = Depends(get_db),

    current_user = Depends(management_required)

):

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:

        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )

    user.is_active = True

    db.commit()

    return {
        "message": "Usuario activado"
    }

# STATUS USER
@router.patch("/users/{user_id}/toggle-status")
def toggle_user_status(

    user_id: int,

    db: Session = Depends(get_db),

    current_user=Depends(user_management_required)

):

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:

        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )

    # Si NO es sysadmin,
    # sólo puede modificar usuarios de su empresa
    if current_user.role != "sysadmin":

        if user.company_id != current_user.company_id:

            raise HTTPException(
                status_code=403,
                detail="Permisos insuficientes"
            )

    user.is_active = not user.is_active

    db.commit()

    return {
        "message": "Estado actualizado",
        "is_active": user.is_active
    }

# CREATE INTERNAL USER
@router.post("/users/create")
def create_internal_user(

    user_data: UserInternalCreate,

    current_user = Depends(management_required),

    db: Session = Depends(get_db)

):

    existing_user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="El usuario ya existe"
        )

    new_user = User(

        first_name=user_data.first_name,

        last_name=user_data.last_name,

        email=user_data.email,

        phone=user_data.phone,

        password=hash_password(
            user_data.password
        ),

        role=user_data.role,

        company_id=current_user.company_id,

        is_platform_user=False

    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return {

        "message": "Usuario creado",

        "email": new_user.email,

        "phone": new_user.phone,

        "role": new_user.role

    }


# GET USERS
@router.get("/users")
def get_users(

    current_user = Depends(get_current_user),

    db: Session = Depends(get_db)

):

    users = db.query(User).filter(
        User.company_id == current_user.company_id
    ).all()

    return [

        {

            "id": user.id,

            "first_name": user.first_name,

            "last_name": user.last_name,

            "full_name": user.full_name,

            "email": user.email,

            "phone": user.phone,

            "role": user.role

        }

        for user in users

    ]


# GET CURRENT USER
@router.get("/me")
def get_me(

    current_user = Depends(get_current_user)

):

    return {

        "id": current_user.id,

        "first_name": current_user.first_name,

        "last_name": current_user.last_name,

        "full_name": current_user.full_name,

        "email": current_user.email,

        "phone": current_user.phone,

        "role": current_user.role,

        "company_id": current_user.company_id,

        "is_platform_user": current_user.is_platform_user

    }


# GET COMPANY INFO
@router.get("/company/me")
def get_my_company(

    current_user = Depends(get_current_user),

    db: Session = Depends(get_db)

):

    if current_user.is_platform_user:

        return {

            "company_name": "Platform",

            "company_id": None,

            "user_email": current_user.email,

            "phone": current_user.phone,

            "role": current_user.role,

            "user_name": current_user.full_name

        }

    company = db.query(Company).filter(
        Company.id == current_user.company_id
    ).first()

    if not company:

        raise HTTPException(
            status_code=404,
            detail="Empresa no encontrada"
        )

    return {

        "company_name": company.name,

        "company_id": company.id,

        "user_email": current_user.email,

        "phone": current_user.phone,

        "role": current_user.role,

        "user_name": current_user.full_name

    }


# CREATE SYSADMIN
@router.post("/create-sysadmin")
def create_sysadmin(

    user_data: UserInternalCreate,

    db: Session = Depends(get_db)

):

    existing_user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="El usuario ya existe"
        )

    new_user = User(

        first_name=user_data.first_name,

        last_name=user_data.last_name,

        email=user_data.email,

        phone=user_data.phone,

        password=hash_password(
            str(user_data.password)[:20]
        ),

        role=ROLE_SYSADMIN,

        is_platform_user=True,

        company_id=None

    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return {

        "message": "Sysadmin creado",

        "email": new_user.email,

        "phone": new_user.phone,

        "role": new_user.role

    }

# CREATE PLATFORM USER
@router.post("/platform/users/create")
def create_platform_user(
    user_data: PlatformUserCreate,
    current_user = Depends(sysadmin_required),
    db: Session = Depends(get_db)
):
    allowed_roles = [
        ROLE_SYSADMIN,
        ROLE_SUPPORT
    ]
    if user_data.role not in allowed_roles:
        raise HTTPException(
            status_code=400,
            detail="Rol inválido"
        )
    existing_user = db.query(User).filter(
        User.email == user_data.email
    ).first()
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="El usuario ya existe"
        )
    new_user = User(
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        email=user_data.email,
        phone=user_data.phone,
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
        "phone": new_user.phone,
        "role": new_user.role
    }

# UPDATE USER
@router.patch("/users/{user_id}")
def update_user(

    user_id: int,

    user_data: UserUpdate,

    db: Session = Depends(get_db),

    current_user=Depends(user_management_required)

):

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:

        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )

    if current_user.role != "sysadmin":

        if user.company_id != current_user.company_id:

            raise HTTPException(
                status_code=403,
                detail="Permisos insuficientes"
            )

    user.first_name = user_data.first_name
    user.last_name = user_data.last_name
    user.email = user_data.email
    user.phone = user_data.phone
    user.role = user_data.role

    db.commit()
    db.refresh(user)

    return {
        "message": "Usuario actualizado"
    }

# UPDATE PASSWORD
@router.patch("/users/{user_id}/password")
def update_user_password(

    user_id: int,

    data: PasswordUpdate,

    db: Session = Depends(get_db),

    current_user=Depends(user_management_required)

):

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:

        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )

    if current_user.role != "sysadmin":

        if user.company_id != current_user.company_id:

            raise HTTPException(
                status_code=403,
                detail="Permisos insuficientes"
            )

    user.password = hash_password(
        data.password
    )

    db.commit()

    return {
        "message": "Contraseña actualizada"
    }
