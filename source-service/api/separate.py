import os
import demucs
from fastapi import UploadFile

def separate_audio(file: UploadFile):
    
    # Save the uploaded file
    temp_dir = "output"  # Change this to your desired output directory
    os.makedirs(temp_dir, exist_ok=True)
    file_path = os.path.join(temp_dir, file.filename)

    with open(file_path, 'wb') as buffer:
        buffer.write(file.file.read())

    # 오디오 소스 분리
    separated_files = demucs.separate.main(["--mp3", "--six-stems", "-n", "htdemucs_6s", file_path])

    # Print the paths of the separated sources
    print("Separated Sources:")
    for path in separated_files:
        print(path)