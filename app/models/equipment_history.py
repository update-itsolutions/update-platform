from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey
)

from datetime import datetime, UTC
from zoneinfo import ZoneInfo

from app.database import Base

class EquipmentHistory(Base):

    __tablename__ = "equipment_history"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    equipment_id = Column(
        Integer,
        ForeignKey("equipments.id")
    )

    event_type = Column(String)

    description = Column(String)

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(UTC)
    )
    