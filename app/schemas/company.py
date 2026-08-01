from pydantic import BaseModel
from typing import Optional

class CompanyCreate(BaseModel):

    name: Optional[str] = None
    business_name: Optional[str] = None
    tax_id: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    province: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None
    website: Optional[str] = None
    industry: Optional[str] = None
    notes: Optional[str] = None

CompanyCreate.model_rebuild()
