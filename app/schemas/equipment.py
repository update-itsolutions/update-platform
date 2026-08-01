from pydantic import BaseModel
from typing import Optional

class EquipmentCreate(BaseModel):

    hostname: str
    mac_address: str

    company_id: Optional[int] = None
    branch_id: Optional[int] = None

    ip_address: Optional[str] = None
    operating_system: Optional[str] = None

    cpu: Optional[str] = None
    ram: Optional[str] = None
    disk_total: Optional[str] = None
    disk_usage: Optional[str] = None
    logged_user: Optional[str] = None
    windows_version: Optional[str] = None

    asset_tag: Optional[str] = None
    notes: Optional[str] = None
    
class EquipmentUpdate(BaseModel):

    asset_tag: str
    hostname: str
    branch_id: int
    notes: Optional[str] = None

class AgentCheckin(BaseModel):

    asset_tag: str
    hostname: str
    mac_address: str

    ip_address: Optional[str] = None

    operating_system: Optional[str] = None

    windows_version: Optional[str] = None

    logged_user: Optional[str] = None

    cpu: Optional[str] = None

    ram: Optional[str] = None

    ram_usage: float

    disk_total: Optional[str] = None

    disk_usage: Optional[str] = None

    disk_free: Optional[str] = None

    uptime: Optional[str] = None

    antivirus_enabled: bool

    firewall_enabled: bool
