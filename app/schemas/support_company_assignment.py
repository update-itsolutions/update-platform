from pydantic import BaseModel


class AssignmentCreate(BaseModel):

    user_id: int

    company_ids: list[int]

class AssignCompaniesRequest(BaseModel):

    company_ids: list[int]
    