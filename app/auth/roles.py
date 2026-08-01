from fastapi import Depends, HTTPException

from app.auth.security import get_current_user

from app.auth.constants import (
    ROLE_SYSADMIN,
    ROLE_SUPPORT,
    ROLE_ADMIN_EMPRESA,
    ROLE_SUPERVISOR,
    ROLE_VIEWER
)

# =========================
# SYSADMIN ONLY
# =========================

def sysadmin_required(
    current_user=Depends(get_current_user)
):

    if current_user.role != ROLE_SYSADMIN:

        raise HTTPException(
            status_code=403,
            detail="Permisos insuficientes"
        )

    return current_user


# =========================
# PLATFORM USERS
# SYSADMIN + SUPPORT
# =========================

def platform_required(
    current_user=Depends(get_current_user)
):

    allowed_roles = [
        ROLE_SYSADMIN,
        ROLE_SUPPORT
    ]

    if current_user.role not in allowed_roles:

        raise HTTPException(
            status_code=403,
            detail="Permisos insuficientes"
        )

    return current_user


# =========================
# COMPANY MANAGEMENT
# ADMIN EMPRESA
# =========================

def management_required(
    current_user=Depends(get_current_user)
):

    allowed_roles = [
        ROLE_ADMIN_EMPRESA
    ]

    if current_user.role not in allowed_roles:

        raise HTTPException(
            status_code=403,
            detail="Permisos insuficientes"
        )

    return current_user


# =========================
# COMPANY OPERATIONS
# ADMIN + SUPERVISOR
# =========================

def supervisor_required(
    current_user=Depends(get_current_user)
):

    allowed_roles = [
        ROLE_ADMIN_EMPRESA,
        ROLE_SUPERVISOR
    ]

    if current_user.role not in allowed_roles:

        raise HTTPException(
            status_code=403,
            detail="Permisos insuficientes"
        )

    return current_user


# =========================
# COMPANY VIEW
# TODOS LOS ROLES EMPRESA
# =========================

def viewer_required(
    current_user=Depends(get_current_user)
):

    allowed_roles = [
        ROLE_ADMIN_EMPRESA,
        ROLE_SUPERVISOR,
        ROLE_VIEWER
    ]

    if current_user.role not in allowed_roles:

        raise HTTPException(
            status_code=403,
            detail="Permisos insuficientes"
        )

    return current_user


# =========================
# EQUIPMENT MANAGEMENT
# SYSADMIN + SUPPORT
# =========================

def equipment_management_required(
    current_user=Depends(get_current_user)
):

    allowed_roles = [
        ROLE_SYSADMIN,
        ROLE_SUPPORT,
        ROLE_ADMIN_EMPRESA,
        ROLE_SUPERVISOR
    ]

    if current_user.role not in allowed_roles:

        raise HTTPException(
            status_code=403,
            detail="Permisos insuficientes"
        )

    return current_user


# =========================
# USER MANAGEMENT
# SYSADMIN + SUPPORT + ADMIN EMPRESA
# =========================

def user_management_required(
    current_user=Depends(get_current_user)
):

    allowed_roles = [
        ROLE_SYSADMIN,
        ROLE_SUPPORT,
        ROLE_ADMIN_EMPRESA
    ]

    if current_user.role not in allowed_roles:

        raise HTTPException(
            status_code=403,
            detail="Permisos insuficientes"
        )

    return current_user

def user_management_required(
    current_user=Depends(get_current_user)
):

    allowed_roles = [

        ROLE_SYSADMIN,
        ROLE_ADMIN_EMPRESA

    ]

    if current_user.role not in allowed_roles:

        raise HTTPException(
            status_code=403,
            detail="Permisos insuficientes"
        )

    return current_user
