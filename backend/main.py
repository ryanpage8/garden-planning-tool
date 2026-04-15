from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return "Garden Planning Tool is Online!"