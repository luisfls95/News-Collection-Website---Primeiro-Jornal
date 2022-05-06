from google.cloud import texttospeech
from moviepy.editor import concatenate_audioclips, AudioFileClip
import os

# define as credenciais para acesso à api da google com base no ficheiro json fornecido pela google
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = './lab5-ua-7fe19cc246c2.json'

#definir dois perfis de vozes diferentes para usar no request mais tarde, fica fora da função pois apenas 2 vozes serão usadas pelo que não é necessário continuamente redefinir as mesmas dentro das funções
male_voice = texttospeech.VoiceSelectionParams(language_code="pt-PT", ssml_gender=texttospeech.SsmlVoiceGender.MALE)
female_voice = texttospeech.VoiceSelectionParams(language_code="pt-PT", ssml_gender=texttospeech.SsmlVoiceGender.FEMALE)


# iniciar um client através do qual se vão fazer os pedidos de tts
client = texttospeech.TextToSpeechClient()

def get_single_audio(text_string, file_name, gender, speed, pitch):

    # definir o encoding do ficheiro
    audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3, speaking_rate=speed, pitch=pitch)

    synthesis_input = texttospeech.SynthesisInput(text=text_string)
    if gender == 'male':
        voice = male_voice
    else:
        voice = female_voice

    # faz o pedido à google API
    response = client.synthesize_speech(input=synthesis_input, voice=voice, audio_config=audio_config)

    #guarda o ficheiro mp3
    with open('./temp_audios/' + file_name + '.mp3', 'wb') as out:
        out.write(response.audio_content)



def get_minimum_length_array(array):
    # esta função serve para decompor o array de paragrafos recebidos, e devolver um novo array com o mesmo conteudo mas com o menor numero de elementos
    # para que os pedidos à API sejam os menores possiveis
    # ex
    # ['Ola, este é um texto de exemplo.', 'Este é o segundo paragrafo.', 'E este o terceiro']
    # a função devolve um array com um elemento : ['Ola, este é um texto de exemplo. Este é o segundo paragrafo. E este o terceiro']

    new_array = []
    string = ''
    # o limite de 5000 é imposto por default pela google api pelo que o tamanho maximo de cada elemento do array a devolver deverá ser 5000
    char_limit = 5000


    for phrase in array:
        if len(string + ' ' + phrase) <= char_limit:
            if string == '':
                string = phrase
            else:
                string = string + ' ' + phrase
        else:
            new_array.append(string)
            string = ''
    if not string == '':
        new_array.append(string)

    return new_array

def make_audio_requests_and_get_paths_array(array, jornal, id, type, gender, speed, pitch):
    # com base num array de paragrafos fazer um pedido à google API para cada elemento do array
    # e guardar o caminho de cada audio pedido

    part = 0
    mp3_paths = []
    # tentar fazer isto em non blocking code
    for phrase in array:
        part += 1
        print(phrase)
        file_name = jornal + '_' + str(id) + '_' + type + '_' + gender + '_' + str(part) + '_'  + str(speed) + '_' + str(pitch)
        get_single_audio(phrase, file_name, gender, speed, pitch)
        mp3_paths.append('./temp_audios/' + file_name + '.mp3')

    # devolve os caminhos dos ficheiros de mp3
    return mp3_paths

def check_if_file_exists(file_name):
    return os.path.isfile('./audios/' + file_name + '.mp3')

def join_audio_files(paths, final_file_name):
    # esta função pega num array de caminhos de ficheiros de mp3 já criados
    # e junta-os pela ordem em que estão no array
    # criando assim um novo ficheiro mp3
    clips = [AudioFileClip(c) for c in paths]
    final_clip = concatenate_audioclips(clips)
    final_clip.write_audiofile('./audios/' + final_file_name + '.mp3')

def return_file(file_name):
    # esta função permite descodificar o ficheiro para que possa ser enviado atraves da resposta a um request
    with open('./audios/' + file_name + '.mp3', 'rb') as sound:
        file = sound.read()
    return file


def get_combined_audio(content_array, jornal, id, type, gender, speed, pitch):
    # esta função agregadora executa as funções anteriormente definidas para:
    # -transformar o array recebido
    # -fazer os pedidos tts à google api
    # -juntar os ficheiros mp3
    # -devolver o ficheiro resultante

    min_length_array = get_minimum_length_array(content_array)
    mp3_paths = make_audio_requests_and_get_paths_array(min_length_array, jornal, id, type, gender, speed, pitch)
    final_file_name = jornal + '_' + str(id) + '_' + type + '_' + gender + '_' + str(speed) + '_' + str(pitch)
    join_audio_files(mp3_paths, final_file_name)

    return return_file(final_file_name)

#get_single_audio('Padre pedro prega pregos, prega pregos padre pedro', 'jornal_id_type' + str(1), 'male', 1, 0)

#get_combined_audio(['Volibear, mata tudo na teamfight volibear, é melhor, é melhor. Volibear é bom'], 'pub', 199283, 'body', 'female', 0.5, 20)