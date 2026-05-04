from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# bifrost db

from database.database import init_db

init_db()  

# Api services
from api.routers import routers_auth
from api.routers import sources

# Minio services
from services.services import init_buckets

init_buckets()

app = FastAPI(
    title="Bifrost API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routers_auth.app, prefix="/auth")
app.include_router(sources.app, prefix="/api")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)