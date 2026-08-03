from datetime import datetime, UTC
from zoneinfo import ZoneInfo

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal

from app.models.equipment import Equipment
from app.models.equipment_history import EquipmentHistory

from app.schemas.equipment import EquipmentCreate
from app.schemas.equipment import EquipmentUpdate
from app.schemas.equipment import AgentCheckin

from app.auth.security import (
    verify_token,
    get_current_user
)

from app.auth.roles import (
    equipment_management_required,
    sysadmin_required,
    platform_required
)

router = APIRouter()

#DB CONNECTION
def get_db():

    db = SessionLocal()
    try:
        yield db
    finally:
     db.close()

#CREATE EQUIPMENT
@router.post("/equipments/")
def create_equipment(

    equipment: EquipmentCreate,
    db: Session = Depends(get_db),
    current_user = Depends(
        sysadmin_required
    )

):

# PLATFORM USERS
    if current_user.is_platform_user:
        if not equipment.company_id:
            return {
                "error": "company_id es requerido"
            }
        company_id = equipment.company_id
# COMPANY USERS
    else:
        company_id = current_user.company_id
    new_equipment = Equipment(
        hostname=equipment.hostname,
        ip_address=equipment.ip_address,
        mac_address=equipment.mac_address,
        operating_system=equipment.operating_system,
        company_id=company_id,
        branch_id=equipment.branch_id,
        
        cpu=equipment.cpu,
        ram=equipment.ram,
        disk_total=equipment.disk_total,
        disk_usage=equipment.disk_usage,

        asset_tag=equipment.asset_tag,
        notes=equipment.notes
    )
    db.add(new_equipment)
    db.commit()
    db.refresh(new_equipment)
    return {
        "message": "Equipo Registrado",
        "equipment_id": new_equipment.id,
        "company_id": new_equipment.company_id,
        "branch_id": new_equipment.branch_id
    }

#EQUIPMENT UPDATE
@router.patch("/equipment/{equipment_id}")
def update_equipment(

    equipment_id: int,

    data: EquipmentUpdate,

    db: Session = Depends(get_db),

    current_user = Depends(platform_required)

):

    equipment = db.query(
        Equipment
    ).filter(
        Equipment.id == equipment_id
    ).first()

    if not equipment:

        raise HTTPException(
            status_code=404,
            detail="Equipo no encontrado"
        )

    equipment.asset_tag = data.asset_tag
    equipment.hostname = data.hostname
    equipment.branch_id = data.branch_id
    equipment.notes = data.notes

    db.commit()

    history = EquipmentHistory(

        equipment_id=equipment.id,

        description=(
            f"{current_user.full_name} actualizó "
            f"los datos del equipo "
            f"{equipment.hostname}"
        )

    )

    db.add(history)
    db.commit()

    return {
        "message": "Equipo actualizado"
    }

#LIST EQUIPMENTS
@router.get("/equipments/")
def get_equipments(

    db: Session = Depends(get_db),
    current_user = Depends(
        equipment_management_required
    )

):

# PLATFORM USERS
    if current_user.is_platform_user:
        equipments = db.query(
            Equipment
        ).all()
# COMPANY USERS
    else:
        equipments = db.query(
            Equipment
        ).filter(
            Equipment.company_id ==
            current_user.company_id
        ).all()
    return [

    {
        "id": eq.id,

        "asset_tag": eq.asset_tag,

        "hostname": eq.hostname,

        "ip_address": eq.ip_address,

        "operating_system": eq.operating_system,

        "is_online": eq.is_online,

        "is_active": eq.is_active,

        "branch_id": eq.branch_id,

        "branch_name": (
            eq.branch.name
            if eq.branch
            else "Sin sucursal"
        )

    }

    for eq in equipments

]

# LIST EQUIPMENTS BY COMPANY
@router.get("/equipments/company/{company_id}")
def get_company_equipments(

    company_id: int,

    db: Session = Depends(get_db),

    current_user = Depends(platform_required)

):

    equipments = db.query(
        Equipment
    ).filter(
        Equipment.company_id == company_id
    ).all()

    return [

        {

            "id": eq.id,

            "asset_tag": eq.asset_tag,

            "hostname": eq.hostname,

            "ip_address": eq.ip_address,

            "operating_system": eq.operating_system,

            "is_online": eq.is_online,

            "is_active": eq.is_active,

            "branch_id": eq.branch_id,

            "branch_name": (
                eq.branch.name
                if eq.branch
                else "Sin sucursal"
            )

        }

        for eq in equipments

    ]

# LIST EQUIPMENTS FOR COMPANY ADMIN
@router.get("/company/equipments")
def get_my_company_equipments(

    db: Session = Depends(get_db),

    current_user = Depends(get_current_user)

):

    equipments = db.query(
        Equipment
    ).filter(
        Equipment.company_id == current_user.company_id
    ).all()

    return [

        {

            "id": eq.id,

            "asset_tag": eq.asset_tag,

            "hostname": eq.hostname,

            "ip_address": eq.ip_address,

            "operating_system": eq.operating_system,

            "is_online": eq.is_online,

            "is_active": eq.is_active,

            "branch_id": eq.branch_id,

            "branch_name": (
                eq.branch.name
                if eq.branch
                else "Sin sucursal"
            )

        }

        for eq in equipments

    ]

# EQUIPMENT ACTIVE/INACTIVE ?
@router.put("/equipments/{equipment_id}/toggle")
def toggle_equipment(

    equipment_id: int,

    db: Session = Depends(get_db),

    current_user = Depends(platform_required)

):

    equipment = db.query(
        Equipment
    ).filter(
        Equipment.id == equipment_id
    ).first()

    if not equipment:

        return {
            "error": "Equipo no encontrado"
        }

    equipment.is_active = not equipment.is_active

    from app.models.audit_log import AuditLog
    
    db.add(

    AuditLog(

        equipment_id=equipment.id,

        user_id=current_user.id,

        action="toggle_equipment",

        description=(
            "Equipo activado"
            if equipment.is_active
            else "Equipo desactivado"
        )

    )
)
    
# ACTIVE/DESCTIVE EQUIPMENT
@router.patch("/equipments/{equipment_id}/toggle-status")
def toggle_equipment_status(

    equipment_id: int,

    db: Session = Depends(get_db),

    current_user = Depends(platform_required)

):

    equipment = db.query(
        Equipment
    ).filter(
        Equipment.id == equipment_id
    ).first()

    if not equipment:

        raise HTTPException(
            status_code=404,
            detail="Equipo no encontrado"
        )

    equipment.is_active = not equipment.is_active

    history = EquipmentHistory(

        equipment_id=equipment.id,

        event_type="STATUS_CHANGE",

        description=(
            "Equipo activado"
            if equipment.is_active
            else "Equipo desactivado"
        ),

        created_by=current_user.email

    )

    db.add(history)

    db.commit()

    return {
        "message": "Estado actualizado"
    }

# GET EQUIPMENT DETAIL
@router.get("/equipment/{equipment_id}")
def get_equipment_detail(

    equipment_id: int,

    db: Session = Depends(get_db),

    current_user = Depends(equipment_management_required)

):

    equipment = db.query(
        Equipment
    ).filter(
        Equipment.id == equipment_id
    ).first()

    if not equipment:

        raise HTTPException(
            status_code=404,
            detail="Equipo no encontrado"
        )

    return {

        "id": equipment.id,

        "hostname": equipment.hostname,

        "asset_tag": equipment.asset_tag,

        "ip_address": equipment.ip_address,

        "mac_address": equipment.mac_address,

        "operating_system": equipment.operating_system,

        "windows_version": equipment.windows_version,

        "logged_user": equipment.logged_user,

        "cpu": equipment.cpu,

        "ram": equipment.ram,

        "ram_usage": equipment.ram_usage,

        "disk_total": equipment.disk_total,

        "disk_usage": equipment.disk_usage,

        "disk_free": equipment.disk_free,

        "is_online": equipment.is_online,

        "is_active": equipment.is_active,

        "notes": equipment.notes,

        "uptime": equipment.uptime,

        "antivirus_enabled": equipment.antivirus_enabled,
        
        "firewall_enabled": equipment.firewall_enabled,

        "last_seen": equipment.last_seen,

        "company_id": equipment.company_id,

        "branch_id": equipment.branch_id,

        "branch_name": (
            equipment.branch.name
            if equipment.branch
            else "Sin sucursal"
        )

    }

# AGENT CHECKIN
@router.post("/agent/checkin")
def agent_checkin(

    data: AgentCheckin,

    db: Session = Depends(get_db)

):

    equipment = db.query(
        Equipment
    ).filter(
        Equipment.asset_tag == data.asset_tag
    ).first()

    if not equipment:

        raise HTTPException(
            status_code=404,
            detail="Equipo no registrado"
        )

    equipment.hostname = data.hostname
    equipment.mac_address = data.mac_address

    equipment.ip_address = data.ip_address

    equipment.operating_system = data.operating_system
    equipment.windows_version = data.windows_version

    equipment.logged_user = data.logged_user

    equipment.cpu = data.cpu
    equipment.ram = data.ram
    equipment.ram_usage = data.ram_usage


    equipment.disk_total = data.disk_total
    equipment.disk_usage = data.disk_usage
    equipment.disk_free = data.disk_free

    equipment.is_online = True

    equipment.uptime = data.uptime
    equipment.antivirus_enabled = data.antivirus_enabled
    equipment.firewall_enabled = data.firewall_enabled

    equipment.last_seen = datetime.now()

    db.commit()

    return {

        "message": "Checkin recibido correctamente",

        "equipment_id": equipment.id

    }

#EQUIPMENT HISTORY
@router.get("/equipments/{equipment_id}/history")
def get_equipment_history(

    equipment_id: int,

    db: Session = Depends(get_db),

    current_user = Depends(get_current_user)

):

    history = db.query(
        EquipmentHistory
    ).filter(
        EquipmentHistory.equipment_id == equipment_id
    ).order_by(
        EquipmentHistory.created_at.desc()
    ).all()

    return [

        {
            "id": h.id,
            "event_type": h.event_type,
            "description": h.description,
            "created_at": h.created_at
        }

        for h in history

    ]

#STATS
@router.get("/stats")
def get_stats(

    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)

    ):

# PLATFORM USERS
    if current_user.is_platform_user:
        total_equipments = db.query(
            Equipment
        ).count()
        online_equipments = db.query(
            Equipment
        ).filter(
            Equipment.is_online == True
        ).count()
        alerts = db.query(
            Equipment
        ).filter(
            Equipment.is_online == False
        ).count()

# COMPANY USERS
    else:
        total_equipments = db.query(
            Equipment
        ).filter(
            Equipment.company_id ==
            current_user.company_id
        ).count()
        online_equipments = db.query(
            Equipment
        ).filter(
            Equipment.company_id ==
            current_user.company_id,
            Equipment.is_online == True
        ).count()
        alerts = db.query(
            Equipment
        ).filter(
            Equipment.company_id ==
            current_user.company_id,
            Equipment.is_online == False
        ).count()
    return {
        "total": total_equipments,
        "online": online_equipments,
        "alerts": alerts
    }

#HEARTBEAT
@router.post("/heartbeat")
def heartbeat(

    equipment: EquipmentCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)

    ):

    existing_equipment = db.query(
        Equipment
    ).filter(
        Equipment.mac_address ==
        equipment.mac_address,
        Equipment.company_id ==
        current_user.company_id
    ).first()
    if existing_equipment:
        existing_equipment.is_online = True
        existing_equipment.cpu = equipment.cpu
        existing_equipment.ram = equipment.ram
        existing_equipment.disk_total = equipment.disk_total
        existing_equipment.disk_usage = equipment.disk_usage
        existing_equipment.ip_address = equipment.ip_address
        existing_equipment.logged_user = equipment.logged_user
        existing_equipment.windows_version = equipment.windows_version
        existing_equipment.last_seen = datetime.now(UTC)
        existing_equipment.asset_tag = equipment.asset_tag
        existing_equipment.notes = equipment.notes
        db.commit()
        return {
            "message": "Equipo Actualizado"
        }
    new_equipment = Equipment(
        hostname=equipment.hostname,
        ip_address=equipment.ip_address,
        mac_address=equipment.mac_address,
        operating_system=equipment.operating_system,
        company_id=current_user.company_id,
        is_online=True,
        last_seen=datetime.now(UTC),
        cpu=equipment.cpu,
        ram=equipment.ram,
        disk_total=equipment.disk_total,
        disk_usage=equipment.disk_usage,
        logged_user=equipment.logged_user,
        windows_version=equipment.windows_version,
        asset_tag=equipment.asset_tag,
        notes=equipment.notes
    )
    db.add(new_equipment)
    db.commit()
    db.refresh(new_equipment)
    return {
            "message": "Equipo nuevo registrado"
    }
