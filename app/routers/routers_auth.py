import uvicorn
from fastapi import APIRouter

app = APIRouter()


@app.get("/")
def root():
    return {
        "message": "Welcome to Bifrost API !",
        "docs": "Visit http://localhost:8000/docs for interactive API documentation"
    }


@app.post("/register")
def register():
    pass

@app.post("/login")
def login():
    pass

@app.post("/me")
def me():
    pass



if __name__ == "__main__":
   

    uvicorn.run(app, host="0.0.0.0", port=8000)
