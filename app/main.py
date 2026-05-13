from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from app.api.routers import sources, meta


app = FastAPI(
    title="Bifrost API",
    description="Platform for collecting and orchestrating data from APIs",
    version="0.1.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

app.include_router(meta.router, prefix="/api", tags=["meta"])
app.include_router(sources.router, prefix="/api/sources", tags=["sources"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.mount("/", StaticFiles(directory="frontend/app", html=True), name="static")
