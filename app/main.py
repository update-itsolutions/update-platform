from app.database import engine
from app.database import Base
from app.models.user import User
from app.routers.users import router as users_router

from app.models.equipment import Equipment
from app.models.company import Company
from app.models.branch import Branch
from app.models.support_company_assignment import SupportCompanyAssignment
from app.models.notification import Notification

from app.routers import equipments
from app.routers import platform
from app.routers import branches
from app.routers import company_users
from app.routers import company_home
from app.routers import company
from app.routers import tickets
from app.routers import support_assignment
from app.routers import platform_users

from app.routers.branches import router as branches_router

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(users_router)
app.include_router(platform.router)
app.include_router(branches.router)
app.include_router(equipments.router)
app.include_router(company.router)
app.include_router(company_users.router)
app.include_router(company_home.router)
app.include_router(tickets.router)
app.include_router(support_assignment.router)
app.include_router(platform_users.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
def home():
    return {
        "status": "Update Platform Online",
    }
