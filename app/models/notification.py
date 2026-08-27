from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    ForeignKey
)

from datetime import datetime, UTC
from sqlalchemy.orm import relationship
from app.database import Base


class Notification(Base):

    __tablename__ = "notifications"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    title = Column(
        String,
        nullable=False
    )

    message = Column(
        String,
        nullable=False
    )

    type = Column(
        String,
        nullable=False
    )

    is_read = Column(
        Boolean,
        default=False
    )

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC)
    )

    ticket_id = Column(
        Integer,
        ForeignKey("tickets.id"),
        nullable=True
    )

    company_id = Column(
        Integer,
        ForeignKey("companies.id"),
        nullable=True
    )

    company = relationship("Company")
