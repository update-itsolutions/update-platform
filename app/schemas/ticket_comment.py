from pydantic import BaseModel

class TicketCommentCreate(BaseModel):
    comment: str
    