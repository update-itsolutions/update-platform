from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey
)

from sqlalchemy.orm import relationship

from datetime import datetime

from app.database import Base


class Ticket(Base):

    __tablename__ = "tickets"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    title = Column(String)

    description = Column(Text)

    priority = Column(
        String,
        default="MEDIUM"
    )

    status = Column(
        String,
        default="OPEN"
    )

    created_at = Column(
        DateTime,
        default=datetime.now
    )

    closed_at = Column(
        DateTime,
        nullable=True
    )

    equipment_id = Column(
        Integer,
        ForeignKey("equipments.id")
    )

    company_id = Column(
        Integer,
        ForeignKey("companies.id")
    )

    created_by = Column(
        Integer,
        ForeignKey("users.id")
    )

    closed_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )

    updated_at = Column(
        DateTime,
        default=datetime.now
    )

    updated_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )

    equipment = relationship(
        "Equipment"
    )

    company = relationship(
        "Company"
    )

    creator = relationship(
        "User",
        foreign_keys=[created_by]
    )

    closer = relationship(
        "User",
        foreign_keys=[closed_by]
    )

    updater = relationship(
        "User",
        foreign_keys=[updated_by]
    )

    comments = relationship(
        "TicketComment",
        back_populates="ticket",
        cascade="all, delete-orphan"
    )

    assigned_to = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )

    assignee = relationship(
        "User",
        foreign_keys=[assigned_to]
    )
    