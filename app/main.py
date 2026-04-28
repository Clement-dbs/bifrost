from fastapi import FastAPI
import uvicorn

from routers import routers_auth, sources

app = FastAPI(
    title="Bifrost API",
    version="1.0.0"
)

@app.get("/")
def root():
    return {"message": "Welcome to Bifrost API"}

app.include_router(routers_auth.router, prefix="/auth")
app.include_router(sources.router, prefix="/api")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)