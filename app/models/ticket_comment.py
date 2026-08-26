from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey
)

from sqlalchemy.sql import func

from sqlalchemy.orm import relationship

from app.database import Base

from datetime import datetime, UTC


class TicketComment(Base):

    __tablename__ = "ticket_comments"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    ticket_id = Column(
        Integer,
        ForeignKey("tickets.id")
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    comment = Column(String)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    ticket = relationship(
        "Ticket",
        back_populates="comments"
    )

    user = relationship(
        "User"
    )