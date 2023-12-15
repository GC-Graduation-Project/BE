from fastapi import APIRouter, UploadFile, File

router = APIRouter()

@router.post('/image')
async def image(file: UploadFile = File(...)):
    