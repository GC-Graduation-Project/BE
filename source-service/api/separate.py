import os
import demucs.api

async def separate_audio(music_file):
    contents = await music_file.read()
    filename = music_file.filename

    # Specify the directory where you want to save the MP3 file
    save_directory = "./upload_mp3/"
    
    # Create the directory if it doesn't exist
    os.makedirs(save_directory, exist_ok=True)

    # Specify the path to save the MP3 file
    save_path = os.path.join(save_directory, filename)
    
    # Save the contents to the specified path
    with open(save_path, "wb") as f:
        f.write(contents)
        print(filename + ' saved')

    # Use another model and segment:
    separator = demucs.api.Separator(model="htdemucs_6s")

    # Separating an audio file
    origin, separated = separator.separate_audio_file(save_path)

    # 파일 이름과 확장자 분리
    name, extension = os.path.splitext(filename)

    # Remember to create the destination folder before calling `save_audio`
    # Or you are likely to recieve `FileNotFoundError`
    for file in separated:
        source = separated.get(file)

        directory = os.path.join("./separated_mp3", name)
        os.makedirs(directory, exist_ok=True)
        result_name = f"{file}.wav"
        path = os.path.join(directory, result_name)
        demucs.api.save_audio(source, path, samplerate=separator.samplerate)

    print('separation finished')    
    wav_file_path = os.path.join("./separated_mp3", name, "guitar.wav")

    return wav_file_path