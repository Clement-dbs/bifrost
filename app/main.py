from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routers import sources

app = FastAPI(
    title="Bifrost API",
    description="Platform for collecting and orchestrating data from APIs",
    version="0.1.0",
)

app.include_router(sources.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Welcome to Bifrost API !",
        "docs": "Visit http://localhost:8000/docs for interactive API documentation",
    }


@app.get("/health", tags=["meta"])
def health():
    return {"status": "ok", "version": "0.1.0"}


@app.get("/info", tags=["Info"])
def info():
    """Returns server information and available endpoints"""
    return {
        "app": "Bifrost FastAPI",
        "version": "0.1.0",
        "framework": "FastAPI",
        "endpoints": [
            {"method": "GET", "path": "/", "description": "Root endpoint"},
            {"method": "GET", "path": "/api/hello", "description": "Hello endpoint"},
            {
                "method": "GET",
                "path": "/api/hello?name=YourName",
                "description": "Hello with name",
            },
            {"method": "GET", "path": "/api/info", "description": "Server info"},
            {
                "method": "GET",
                "path": "/docs",
                "description": "Interactive API documentation",
            },
            {"method": "GET", "path": "/redoc", "description": "ReDoc documentation"},
        ],
        "documentation": {
            "swagger_ui": "http://localhost:8000/docs",
            "redoc": "http://localhost:8000/redoc",
            "openapi_json": "http://localhost:8000/openapi.json",
        },
    }
