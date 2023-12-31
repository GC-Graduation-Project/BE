import os
import time
from basic_pitch.inference import predict_and_save

def convert_midi(separated_audio):
    # 입력 오디오 파일의 경로 (bass.wav 파일이 있는 경로를 지정해주세요)
    input_audio_path = separated_audio
    
    # 결과 파일들을 저장할 디렉토리 경로 (원하는 저장 위치를 지정해주세요)
    timestamp = int(time.time())
    output_directory = f"converted_midi/{timestamp}"
    os.makedirs(output_directory, exist_ok=True)
    
    # MIDI 파일을 저장할지 여부 (True 또는 False로 설정)
    save_midi = True

    # MIDI 파일을 WAV 오디오로 렌더링하여 저장할지 여부 (True 또는 False로 설정)
    sonify_midi = False
    
    # Raw 모델 출력을 NPZ 파일로 저장할지 여부 (True 또는 False로 설정)
    save_model_outputs = False

    # 예측된 음표 이벤트를 CSV 파일로 저장할지 여부 (True 또는 False로 설정)
    save_notes = False

    # predict_and_save 함수를 호출하여 분석과 결과 파일 저장 수행
    predict_and_save(
        [input_audio_path],
        output_directory,
        save_midi,
        sonify_midi,
        save_model_outputs,
        save_notes
    )

    # 변환된 MIDI 파일의 경로를 반환
    filename = os.path.splitext(os.path.basename(input_audio_path))[0]
    midi_file_path = os.path.join(output_directory, f"{filename}_basic_pitch.mid")
    return midi_file_path
