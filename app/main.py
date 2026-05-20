from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import connectors, state


app = FastAPI(
    title="Bifrost API",
    description="Platform for collecting and orchestrating data from APIs",
    version="0.1.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

app.include_router(state.router, prefix="/api", tags=["meta"])
app.include_router(connectors.router, prefix="/api/connectors", tags=["connectors"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
