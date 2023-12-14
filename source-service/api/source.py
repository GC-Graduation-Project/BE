import api.separate as separateApi
import api.convert as convertApi
from fastapi import APIRouter, UploadFile, File

router = APIRouter()

@router.post('/source')
async def source(file: UploadFile = File(...)): 
    #separated_audio = separateApi.separate_audio(file)
    #convertApi.convert_midi(separated_audio)
    convertApi.convert_midi(file)
    return {"message": "Audio separated successfully."}
