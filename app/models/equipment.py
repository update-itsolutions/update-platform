from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    ForeignKey
)

from sqlalchemy.orm import relationship

from app.database import Base
from datetime import datetime, UTC

class Equipment(Base):

    __tablename__ = "equipments"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    hostname = Column(String)

    ip_address = Column(String)

    mac_address = Column(
        String,
        unique=True
    )

    operating_system = Column(String)

    cpu = Column(String)

    ram = Column(String)

    ram_usage = Column(String)

    disk_total = Column(String)

    disk_free = Column(String)

    disk_usage = Column(String)

    logged_user = Column(String)

    windows_version = Column(String)

    is_online = Column(
        Boolean,
        default=False
    )

    last_seen = Column(
        DateTime(UTC)
    )

    is_active = Column(
    Boolean,
    default=True,
    nullable=False
    )   

    notes = Column(
    String,
    nullable=True
    )

    asset_tag = Column(
    String,
    nullable=True
    )
    
    company_id = Column(
        Integer,
        ForeignKey("companies.id")
    )

    branch_id = Column(
        Integer,
        ForeignKey("branches.id"),
        nullable=True
    )

    antivirus_enabled = Column(Boolean)

    firewall_enabled = Column(Boolean)

    uptime = Column(String)
    
    # RELATIONS

    company = relationship(
        "Company",
        back_populates="equipments"
    )

    branch = relationship(
        "Branch",
        back_populates="equipments"
    )

    