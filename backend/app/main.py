from fastapi import FastAPI
from app.routes import questions

app = FastAPI(title="LiTrivia API")

app.include_router(questions.router)

@app.get("/")
def health():
    return {"status": "ok"}