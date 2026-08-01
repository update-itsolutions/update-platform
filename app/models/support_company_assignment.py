from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import ForeignKey
from sqlalchemy import DateTime
from sqlalchemy.sql import func

from app.database import Base


class SupportCompanyAssignment(Base):

    __tablename__ = "support_company_assignments"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    company_id = Column(
        Integer,
        ForeignKey("companies.id")
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
