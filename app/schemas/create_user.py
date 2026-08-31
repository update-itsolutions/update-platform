from pydantic import BaseModel


class CreateUserByAdmin(BaseModel):

    first_name: str
    last_name: st
    email: str
    password: str
    role: str
    phone: str | None = None
    