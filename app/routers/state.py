from fastapi import APIRouter

router = APIRouter()


@router.get("/", tags=["root"])
def root():
    return {
        "message": "Welcome to Bifrost API !",
        "docs": "Visit http://localhost:8000/docs for interactive API documentation",
    }


@router.get("/health", tags=["meta"])
def health():
    return {
        "status": "ok",
        "version": "0.1.0",
    }


@router.get("/info", tags=["meta"])
def info():
    """Returns server information and available endpoints"""
    return {
        "app": "Bifrost",
        "version": "0.1.0",
        "framework": "FastAPI",
        "endpoints": [
            {"method": "GET", "path": "/", "description": "Frontend — Bifrost UI"},
            {"method": "GET", "path": "/api/health", "description": "Health check"},
            {
                "method": "GET",
                "path": "/api/info",
                "description": "Server info & endpoints",
            },
            {
                "method": "POST",
                "path": "/api/connectors/",
                "description": "Create a new API connector",
            },
            {
                "method": "GET",
                "path": "/api/connectors/",
                "description": "List all connectors",
            },
            {
                "method": "GET",
                "path": "/api/connectors/{id}",
                "description": "Get a connector by ID",
            },
            {
                "method": "DELETE",
                "path": "/api/connectors/{id}",
                "description": "Delete a connector",
            },
        ],
        "documentation": {
            "swagger_ui": "http://localhost:8000/api/docs",
            "redoc": "http://localhost:8000/api/redoc",
            "openapi_json": "http://localhost:8000/api/openapi.json",
        },
    }
