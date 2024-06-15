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

# 노트를 기타 프렛의 위치로 매핑하는 함수
def get_guitar(note):
    mapping = {
        'E4': ['0/1', '5/2', '9/3'],
        'F4': ['1/1', '6/2', '10/3'],
        'F#4': ['2/1', '7/2', '11/3'],
        'G4': ['3/1', '8/2', '12/3', '17/4', '22/5'],
        'G#4': ['4/1', '9/2', '13/3', '18/4'],
        'A4': ['5/1', '10/2', '14/3', '19/4'],
        'A#4': ['6/1', '11/2', '15/3', '20/4'],
        'B4': ['7/1', '12/2', '16/3', '21/4'],
        'C5': ['8/1', '13/2', '17/3', '22/4'],
        'C#5': ['9/1', '14/2', '18/3'],
        'D5': ['10/1', '15/2', '19/3'],
        'D#5': ['11/1', '16/2', '20/3'],
        'E5': ['12/1', '17/2', '21/3'],
        'F5': ['13/1', '18/2', '22/3'],
        'F#5': ['14/1', '19/2'],
        'G5': ['15/1', '20/2'],
        'G#5': ['16/1', '21/2'],
        'A5': ['17/1', '22/2'],
        'B3': ['0/2', '4/3', '9/4', '14/5', '19/6'],
        'C4': ['1/2', '5/3', '10/4', '15/5', '20/6'],
        'C#4': ['2/2', '6/3', '11/4', '16/5', '21/6'],
        'D4': ['3/2', '7/3', '12/4', '17/5', '22/6'],
        'D#4': ['4/2', '8/3', '13/4', '18/5'],
        'E4': ['4/2', '8/3', '13/4', '18/5'],
        'G3': ['0/3', '5/4', '10/5', '15/6'],
        'G#3': ['1/3', '6/4', '11/5', '16/6'],
        'A3': ['2/3', '7/4', '12/5', '17/6'],
        'A#3': ['3/3', '8/4', '13/5', '18/6'],
        'D3': ['0/4', '5/5', '10/6'],
        'D#3': ['1/4', '6/5', '11/6'],
        'E3': ['2/4', '7/5', '12/6'],
        'F3': ['3/4', '8/5', '13/6'],
        'F#3': ['4/4', '9/5', '14/6'],
        'A2': ['0/5', '5/6'],
        'A#2': ['1/5', '6/6'],
        'B2': ['2/5', '7/6'],
        'C3': ['3/5', '8/6'],
        'C#3': ['4/5', '9/6'],
        'E2': ['0/6'],
        'F2': ['1/6'],
        'F#2': ['2/6'],
        'G2': ['3/6'],
        'G#2': ['4/6']
    }
    positions = mapping.get(note, ["해당 문자열에 대한 숫자가 없습니다."])
    return min(positions, key=lambda x: int(x.split('/')[0]))

# 변환된 결과를 문장으로 변환하는 함수
def convert_to_sentence(mapped_result_list):
    complete_sentence = ""

    note_mapping = {
        'gClef': ('treble ', 0),
        'fClef': ('bass', 0),
        'four_four': ('time=4/4\nnotes', 0),
        'quarter_note': (' :q ', 0.25),
        'half_note': (' :h ', 0.5),
        'half_note_dot': (' :hd ', 0.75),
        'dot_half_note': (' :hd ', 0.75),
        'dot_half_note_dot': (' :hd ', 0.75),
        'quarter_note_dot': (' :qd ', 0.375),
        'dot_quarter_note_dot': (' :qd ', 0.375),
        'eight_note': (' :8 ', 0.125),
        'eight_note_dot': (' :8d ', 0.1875),
        'sixteen_note': (' :16 ', 0.0625),
        'sixteen_note_dot': (' :16d ', 0.09375),
        'whole_note': (' :w ', 1),
        'quarter_rest': (' :4 ##', 0.25),
        'half_rest': (' :2 ##', 0.5),
        'half_rest_dot': (' :2d ##', 0.75),
        'quarter_rest_dot': (' :4d ##', 0.375),
        'eight_rest': (' :8 ##', 0.125),
        'eight_rest_dot': (' :8d ##', 0.1875),
        'sixteen_rest': (' :16 ##', 0.0625),
        'sixteen_rest_dot': (' :16d ##', 0.09375),
        'whole_rest': (' :w ##', 1),
        'sharp': (' #', 0)
    }

    for result in mapped_result_list:
        sen = "\ntabstave notation=true clef="  # 각 리스트에 대해 새 탭스태브 시작
        current_time = 0  # 각 라인에 대한 현재 시간 초기화
        sharp_count = 0  # 각 라인에 대한 샤프 수 초기화
        four_four_found = False
        gclef_found = False

        for i, item in enumerate(result):
            action, value = note_mapping.get(item[0], ('', 0))

            if item[0] == 'sharp':
                sharp_count += 1
                continue  # 샤프 심볼 추가를 건너뜀

            if item[0] == 'gClef':
                gclef_found = True

            if item[0] == 'four_four':
                four_four_found = True
                if sharp_count == 1:
                    sen += " key=G "  # 샤프가 정확히 하나인 경우 key=G 추가
                    sharp_count = 0  # key=G 추가 후 샤프 수 초기화

            if current_time + value > 1:  # 마디 길이가 1을 초과하면 바 라인 추가
                sen += " |"
                current_time = 0

            if action:  # 문장에 액션 추가
                sen += action
                if item[0] not in ['gClef', 'fClef', 'four_four', 'quarter_rest']:
                    sen += item[1]  # 해당하는 경우 노트 상세 정보 추가

            current_time += value

        # gClef가 있지만 four_four가 없는 경우 확인
        if gclef_found and not four_four_found and sharp_count == 1:
            sen = sen.replace('clef=treble', 'clef=treble key=G\nnotes')
        elif gclef_found and not four_four_found:
            sen = sen.replace('clef=treble', 'clef=treble \nnotes')
        sen += " =|="
        complete_sentence += sen

    return complete_sentence