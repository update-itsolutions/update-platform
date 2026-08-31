from pydantic import BaseModel
from typing import Optional


class UserCreate(BaseModel):

    first_name: str
    last_name: str
    company_name: str
    email: str
    password: str
    phone: str | None = None

class UserInternalCreate(BaseModel):

    first_name: str
    last_name: str
    email: str
    password: str
    role: str
    phone: str | None = None

class CreateUserByAdmin(BaseModel):

    first_name: str
    last_name: str
    email: str
    password: str
    role: str
    phone: str | None = None

class PlatformUserCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
    role: str
    phone: str | None = None

class CompanyUserCreate(BaseModel):
    company_id: int
    first_name: str
    last_name: str
    email: str
    password: str
    role: str
    phone: str | None = None

class UserUpdate(BaseModel):
    first_name: str
    last_name: str
    email: str
    role: str
    phone: str | None = None

class PasswordUpdate(BaseModel):
    password: str
