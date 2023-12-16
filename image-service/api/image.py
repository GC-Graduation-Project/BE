import io

from fastapi import APIRouter, UploadFile, File
import requests
from fastapi.responses import PlainTextResponse
import cv2
import numpy as np
import api.modules as md
import api.functions as fs
import api.pitchDetection
from fastapi.responses import StreamingResponse

router = APIRouter()

@router.post('/image')
async def image(file: UploadFile = File(...)):
        # 파일 내용 읽기
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # 이미지 처리 및 분석
        final_list = []
        image_0, subimages = md.remove_noise(img)

        normalized_images, stave_list = md.digital_preprocessing(image_0, subimages)

        rec_list, note_list, rest_list = md.beat_extraction(normalized_images)

        clef_list = pitchDetection.detect1(cv2.cvtColor(cv2.bitwise_not(image_0), cv2.COLOR_GRAY2BGR))

        note_list2, pitch_list = md.pitch_extraction(stave_list, normalized_images, clef_list)

        for i, (rec, pitches) in enumerate(zip(rec_list, pitch_list)):
            sharps, flats = fs.count_sharps_flats(rec)
            temp_dict = {}
            modified_pitches = fs.modify_notes(pitches, sharps, flats)
            for pit in modified_pitches:
                positions = fs.get_guitar(pit)
                temp_dict[pit] = positions
            modified_pitches = fs.calculate_efficient_positions(modified_pitches, temp_dict)
            pitch_list[i] = modified_pitches  # Update the pitch_list with modified pitches

        for note2, note1 in zip(note_list2, note_list):
            note2[1:] = fs.update_notes(note2[1:], note1)

        for list1, list2, list3 in zip(rec_list, note_list2, pitch_list):
            m_list = fs.merge_three_lists(list1, list2, list3)
            final_list.append(m_list)

        print(final_list)

        sen = fs.convert_to_sentence(final_list)

        digital = await tab(sen)
        return digital

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
