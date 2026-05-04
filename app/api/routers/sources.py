import uvicorn
from fastapi import APIRouter, Form
from typing import Optional
from api.request import APIExtractor
from services.services import save_source, list_sources, remove_source, edit_source
from pydantic import BaseModel

# stocker sur minio 
#upload(api_extractor._get())

app = APIRouter()

class SourceUpdate(BaseModel):
    auth_type: Optional[str] = None
    url:       Optional[str] = None
    api_key:   Optional[str] = None
    format:    Optional[str] = None
    headers:   Optional[str] = None
    status:    Optional[str] = None

@app.get("/")
def root():
    return {
        "message": "Welcome to Bifrost API !",
        "docs": "Visit http://localhost:8000/docs for interactive API documentation"
    }


@app.post("/form")
def add_source(
    api_name_source:     str           = Form(...),
    authentification_type: str         = Form(...),
    api_url:             str           = Form(...),
    api_key:             Optional[str] = Form(None),
    response_format:     str           = Form(...),
    header_params:       Optional[str] = Form(None)
):
    save_source({
        "api_name":      api_name_source,
        "auth_type": authentification_type,
        "url":       api_url,
        "api_key":   api_key,
        "format":    response_format,
        "headers":   header_params,
        "status":    "active"
    })
    return {"code": 200, "message": "Source sauvegardée"}

@app.get("/sources")
def list_all_sources():
    return list_sources()

@app.patch("/sources/{name}")
def update_one_source(name: str, body: SourceUpdate):
    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    if not updates:
        return {"code": 400, "message": "Aucune donnée à mettre à jour"}
    edit_source(name, updates)
    return {"code": 200, "message": f"Source '{name}' mise à jour"}

@app.delete("/sources/{name}")
def delete_one_source(name: str):
    remove_source(name)
    return {"code": 200, "message": f"Source '{name}' supprimée"}

@app.get("/info", tags=["Info"])
def info():
    """Returns server information and available endpoints"""
    return {
        "app": "FastAPI Demo 1",
        "version": "1.0.0",
        "framework": "FastAPI",
        "endpoints": [
            {"method": "GET", "path": "/", "description": "Root endpoint"},
            {"method": "GET", "path": "/api/hello", "description": "Hello endpoint"},
            {"method": "GET", "path": "/api/hello?name=YourName", "description": "Hello with name"},
            {"method": "GET", "path": "/api/info", "description": "Server info"},
            {"method": "GET", "path": "/docs", "description": "Interactive API documentation"},
            {"method": "GET", "path": "/redoc", "description": "ReDoc documentation"}
        ],
        "documentation": {
            "swagger_ui": "http://localhost:8000/docs",
            "redoc": "http://localhost:8000/redoc",
            "openapi_json": "http://localhost:8000/openapi.json"
        }
    }


@app.get("/health", tags=["Health"])
def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "service": "FastAPI Hello World Demo"
    }


if __name__ == "__main__":
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
