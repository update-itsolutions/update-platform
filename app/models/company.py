from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy.orm import relationship

from app.database import Base

class Company(Base):

    __tablename__ = "companies"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # NOMBRE FANTASIA
    name = Column(
        String,
        nullable=False
    )

    # RAZON SOCIAL
    business_name = Column(
        String,
        nullable=True
    )

    # CUIT
    tax_id = Column(
        String,
        nullable=True
    )

    email = Column(
        String,
        nullable=True
    )

    phone = Column(
        String,
        nullable=True
    )

    address = Column(
        String,
        nullable=True
    )

    city = Column(
        String,
        nullable=True
    )

    province = Column(
        String,
        nullable=True
    )

    postal_code = Column(
        String,
        nullable=True
    )

    country = Column(
        String,
        nullable=True
    )
    
    website = Column(
        String,
        nullable=True
    )

    industry = Column(
        String,
        nullable=True
    )

    status = Column(
        String,
        default="active"
    )

    notes = Column(
        String,
        nullable=True
    )

    users = relationship(
        "User",
        back_populates="company"
    )

    equipments = relationship(
        "Equipment",
        back_populates="company"
    )

    branches = relationship(
        "Branch",
        back_populates="company"
    )

