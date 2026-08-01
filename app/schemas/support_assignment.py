from pydantic import BaseModel

class AssignCompaniesRequest(BaseModel):

    company_ids: list[int]
    