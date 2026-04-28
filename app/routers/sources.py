import uvicorn
from fastapi import APIRouter, Form
from typing import Optional
from api.request import APIExtractor

app = APIRouter()


@app.get("/")
def root():
    return {
        "message": "Welcome to Bifrost API !",
        "docs": "Visit http://localhost:8000/docs for interactive API documentation"
    }


@app.post("/api/form")
def print_data(
    api_name_source: str = Form(...),
    authentification_type: str = Form(...),
    api_url:str = Form(...),
    api_key: Optional[str] = Form(None),
    response_format: str = Form(...),
    header_params: Optional[str] = Form(None)
):
    
    api_extractor = APIExtractor(api_url=api_url, authentification_type=authentification_type,api_key=api_key, response_format=response_format, header_params=header_params)
    
    try:
        return {
            "code" : 200,
            "message": "Données extraite avec succès",
            "data" : api_extractor._get()
        }
    except Exception as e:
        print(f"Erreur : {e}")


@app.get("/api/info", tags=["Info"])
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


@app.get("/api/health", tags=["Health"])
def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "service": "FastAPI Hello World Demo"
    }


if __name__ == "__main__":
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
