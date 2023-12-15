import requests, io
import api.separate as separateApi
import api.convert as convertApi
import api.reading as readApi
import api.reading_bass as read_bassApi
import api.parsing as parseApi
from fastapi import APIRouter, UploadFile, File
from fastapi.responses import StreamingResponse

router = APIRouter()

@router.post('/source')
async def source(file: UploadFile = File(...)): 
    #separated_audio = await separateApi.separate_audio(file)
    #midi_file_path = convertApi.convert_midi(separated_audio)
    #audio_data = readApi.read_midi(midi_file_path)
    #parsed_data = parseApi.parse_data(audio_data)
    parsed_data = '''
    tabstave notation=true clef=treble
    notes :q 14/5 :q 12/5 :q 10/5 :q 12/5 | :q 14/5 :q 14/5 :h 14/5 | :q 12/5 :q 12/5 :h 12/5 | :q 14/5 :q 17/5 :h 17/5 | :q 14/5 :q 12/5 :q 10/5 :q 12/5
    tabstave notation=true clef=treble
    notes :q 14/5 :q 14/5 :q 14/5 :q 14/5 | :q 12/5 :q 12/5 :q 14/5 :q 12/5 | :h 10/5 :4 ## :q 12/5 | :qd 14/5 :8 12/5 :q 10/5 :q 12/5 | :q 14/5 :q 14/5 :h 14/5
    tabstave notation=true clef=treble
    notes :q 12/5 :q 12/5 :h 12/5 | :q 14/5 :q 17/5 :h 17/5 | :qd 14/5 :8 12/5 :q 10/5 :q 12/5 | :q 14/5 :q 14/5 :q 14/5 :q 14/5 | :q 12/5 :q 12/5 :q 14/5 :q 12/5 | :w 10/5 =|=
    '''
    image = await tab(parsed_data)
    return image

async def tab(parsed_data):
    url = "http://localhost:8000/tab/getSVG"
    headers = {'Content-Type': 'text/plain'}
    payload = parsed_data

    try:
        # POST 요청 보내기
        response = requests.post(url, headers=headers, data=payload)
        # 응답 확인
        if response.status_code == 200:
            # 성공적으로 요청이 처리됨
            print("Request successful")
            # 이미지 데이터를 받아온다
            image_data = response.content
            # 이미지 데이터를 클라이언트에게 반환
            return StreamingResponse(io.BytesIO(image_data), media_type="image/png")
        else:
            # 요청 실패
            print(f"Request failed with status code: {response.status_code}")
    except Exception as e:
        # 예외 처리
        print(f"An error occurred: {e}")
