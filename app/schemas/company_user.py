from pydantic import BaseModel, EmailStr

class CompanyUserCreate(BaseModel):

    first_name: str
    last_name: str
    email: EmailStr
    password: str

    role: str

    company_id: int
    