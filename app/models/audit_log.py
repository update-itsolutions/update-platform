from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey
)

from sqlalchemy.orm import relationship

from datetime import datetime

from app.database import Base


class AuditLog(Base):

    _tablename_ = "audit_logs"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    equipment_id = Column(
        Integer,
        ForeignKey("equipments.id")
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )

    action = Column(String)

    description = Column(String)

    created_at = Column(
        DateTime,
        default=datetime.now
    )

    equipment = relationship(
        "Equipment"
    )

    user = relationship(
        "User"
    )
    