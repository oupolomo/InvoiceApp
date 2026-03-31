from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import invoices, settings
from app.db.database import init_db

from fastapi import Depends
from app.auth import require_password

app = FastAPI(dependencies=[Depends(require_password)])

origins = [
    "http://localhost:5173",
    "https://desirable-purpose-production-e9be.up.railway.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(invoices.router)
app.include_router(settings.router)

@app.on_event("startup")
def startup():
    init_db()

@app.get("/")
def root():
    return {"message": "Backend running"}

@app.get("/ping")
def ping():
    return {"message": "pong"}