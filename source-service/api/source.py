import api.separate as separateApi
import api.convert as convertApi
import api.reading as readApi
import api.reading_bass as read_bassApi
from fastapi import APIRouter, UploadFile, File

router = APIRouter()

@router.post('/source')
async def source(file: UploadFile = File(...)): 
    separated_audio = await separateApi.separate_audio(file)
    midi_file_path = convertApi.convert_midi(separated_audio)
    readApi.read_midi(midi_file_path)
    return {"message": "Audio separated successfully."}
