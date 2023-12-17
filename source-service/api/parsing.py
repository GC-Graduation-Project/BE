def parse_data(audio_data):
    print(audio_data)
    return audio_data

def group_list(input_list, group_size):
    # 각 그룹을 생성합니다.
    result = [input_list[i:i + group_size] for i in range(0, len(input_list), group_size)]

    # 각 그룹의 시작 부분에 ['Treble', 'B4']를 삽입합니다.
    for group in result:
        group.insert(0, ['Treble', 'B4'])

    return result

def get_number(note):
    mapping = {
        'E4': '9/3',
        'F4': '10/3',
        'F#4': '11/3',
        'G♭4': '11/3',
        'G4': '12/3',
        'G#4': '13/3',
        'A♭4': '13/3',
        'A4': '14/3',
        'A#4': '15/3',
        'B♭4': '15/3',
        'B4': '16/3',
        'C5': '17/3',
        'C#5': '14/2',
        'D♭5': '14/2',
        'D5': '15/2',
        'D#5': '16/2',
        'E♭5': '16/2',
        'E5': '12/1',
        'F5': '13/1',
        'F#5': '14/1',
        'G♭5': '14/1',
        'G5': '15/1',
        'G#5': '16/1',
        'A♭5': '16/1',
        'A5': '17/1',
        'A#5': '18/1',
        'B♭5': '18/1',
        'B5': '19/1',
        'C6': '20/1',
        'C#6': '21/1',
        'D♭6': '21/1',
        'D6': '22/1',
        'B3': '0/2',
        'C4': '1/2',
        'C#4': '2/2',
        'D♭4': '2/2',
        'D4': '3/2',
        'D#4': '4/2',
        'E♭4': '4/2',
        'G3': '5/4',
        'G#3': '6/4',
        'A♭3': '6/4',
        'A3': '7/4',
        'A#3': '8/4',
        'B♭3': '8/4',
        'D3': '0/4',
        'D#3': '1/4',
        'E♭3': '1/4',
        'E3': '2/4',
        'F3': '3/4',
        'F#3': '9/5',
        'G♭3': '9/5',
        'A2': '0/5',
        'A#2': '1/5',
        'B♭2': '1/5',
        'B2': '2/5',
        'C3': '3/5',
        'C#3': '4/5',
        'D♭3': '4/5',
        'E2': '0/6',
        'F2': '1/6',
        'F#2': '2/6',
        'G♭2': '2/6',
        'G2': '3/6',
        'G#2': '4/6',
        'A♭2': '4/6'
    }
    return mapping.get(note, "해당 문자열에 대한 숫자가 없습니다.")

def convert_to_sentence(mapped_result_list):
    memorize_index = []
    sen = ""

    note_mapping = {
        'Treble': ('\ntabstave notation=true clef=treble\nnotes', 0),
        'Quarter Note': (' :q ', 0.25),
        'Half Note': (' :h ', 0.5),
        'Dotted Quarter Note': (' :qd ', 0.375),
        'Eight Note': (' :8 ', 0.125),
        'Eight rest': (' :8 ## ', 0.125),
        'Whole Note': (' :w ', 1),
        'Quarter rest': (' :4 ## ', 0.25),
        'Dotted Eight Note': (' :8d ', 0.1875),
        'Sixteen Note': (' :16 ', 0.0625),
        'Sixteenth rest': (' :16 ## ', 0.0625),
        'Dotted Half Note': (' :hd ', 0.75),
        'Half rest' : (' :h ## ', 0.5),
        'Dotted Eighth rest' : (' :8d ## ', 0.1875),
        'Dotted Quarter rest' : (' :4d ## ', 0.375),
        'Dotted Half rest' : (' :hd ## ', 0.75)
    }

    for result in mapped_result_list:
        print(result)
        k = 0  # 각 result 리스트마다 k 값을 초기화
        for i in range(len(result)):
            action, value = note_mapping.get(result[i][0], ('', 0))
            if k >= 1:
                memorize_index.append([i])
                sen += " |"
                k = 0
            sen += action
            if result[i][0] not in ['Treble', 'Quarter Rest']:
                sen += get_number(result[i][1])
            k += value

    sen += " =|="
    return sen