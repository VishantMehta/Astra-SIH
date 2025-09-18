from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.api import endpoints
from app.core.database import create_db_and_tables

# This is the new lifespan context manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting up...")
    create_db_and_tables()
    yield
    print("Shutting down...")

app = FastAPI(title="Astra Project API", lifespan=lifespan)

app.include_router(endpoints.router)