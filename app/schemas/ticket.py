from pydantic import BaseModel
from typing import Optional


class TicketCreate(BaseModel):

    title: str

    description: str

    priority: str

    equipment_id: int


class TicketResponse(BaseModel):

    id: int

    title: str

    description: str

    priority: str

    status: str

    created_at: Optional[str]

    created_by_name: Optional[str]
    