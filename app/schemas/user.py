from pydantic import BaseModel
from typing import Optional


class UserCreate(BaseModel):

    first_name: str
    last_name: str
    company_name: str
    email: str
    password: str

class UserInternalCreate(BaseModel):

    first_name: str
    last_name: str
    email: str
    password: str
    role: str


class CreateUserByAdmin(BaseModel):

    first_name: str
    last_name: str
    email: str
    password: str
    role: str

class PlatformUserCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
    role: str

class CompanyUserCreate(BaseModel):
    company_id: int
    first_name: str
    last_name: str
    email: str
    password: str
    role: str

class UserUpdate(BaseModel):
    first_name: str
    last_name: str
    email: str
    role: str

class PasswordUpdate(BaseModel):
    password: str
