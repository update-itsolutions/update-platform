from pydantic import BaseModel

class UserCompanyAssignment(BaseModel):

    company_ids: list[int]

class PlatformUserUpdate(BaseModel):

    first_name: str
    last_name: str
    email: str
    phone: str | None = None
    role: str
    password: str | None = None

class PlatformUserStatusUpdate(BaseModel):

    is_active: bool

