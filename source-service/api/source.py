from fastapi import APIRouter, UploadFile, File

router = APIRouter()

@router.post('/source', tags=['post'])
async def upload_file(file: UploadFile = File(...)):
    return {"filename": file.filename}
