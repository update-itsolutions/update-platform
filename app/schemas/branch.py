from pydantic import BaseModel

class BranchCreate(BaseModel):

    company_id: int
    name: str
    address: str
    city: str
    province: str

class BranchUpdate(BaseModel):

    name: str
    address: str
    city: str
    province: str
