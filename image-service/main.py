import os
import uvicorn
from fastapi import FastAPI
from api import image

app = FastAPI()

port = int(os.environ.get("SOURCE_PORT", 8003))

app.include_router(image.router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=port, reload=True)