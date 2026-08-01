from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):

    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    email = Column(
        String,
        unique=True,
        index=True
    )

    password = Column(String)

    is_active = Column(
        Boolean,
        default=True,
        nullable=False
    )

    # NUEVO
    first_name = Column(String)

    # NUEVO
    last_name = Column(String)

    # NUEVO
    is_platform_user = Column(
        Boolean,
        default=False
    )

    role = Column(String)

    company_id = Column(
        Integer,
        ForeignKey("companies.id"),
        nullable=True
    )

    company = relationship(
        "Company",
        back_populates="users"
    )

    @property
    def full_name(self):

        return f"{self.first_name} {self.last_name}"



