from flask import Flask
from flask import request, make_response
from flask_cors import CORS, cross_origin
from main import *
from tts import *


app = Flask(__name__)
CORS(app)

@app.route("/")
@cross_origin(origin='*')
def home():
    return {'LAB5_API': 'working'}

@app.route("/fetch/", methods=['POST'])
@cross_origin(origin='*')
def fetch_link():
    if request.method == 'POST':
        link_url = request.json['link']
        print(link_url)
        return fetch_custom(link_url)


@app.route("/pub/<id>")
@cross_origin(origin='*')
def hello_there(id):
    match_object = id.isdecimal()
    if match_object:
        content = getAllFields(id)
    else:
        content = "id invalido - param so pode ter numeros"
    return content

@app.route("/obs/<id>")
@cross_origin(origin='*')
def observador(id):
    match_object = id.isdecimal()
    if match_object:
        content = getAllFieldsObservador(id)
    else:
        content = "id invalido - param so pode ter numeros"
    return content

@app.route("/audio/", methods=['POST', 'GET'])
@cross_origin(origin='*')
def fetch_audio():
    # para testes basicamente
    if request.method == 'POST':
        contents_array = request.json['contents']
        type = request.json['type']
        id = request.json['id']
        gender = request.json['gender']
        jornal = request.json['jornal']
        speed = request.json['speed']
        pitch = request.json['pitch']


        # check se o ficheiro ja existe - se ja foi renderizado ou nao
        file_name = jornal + '_' + str(id) + '_' + type + '_' + gender + '_' + str(speed) + '_' + str(pitch)
        if check_if_file_exists(file_name):
            response = make_response(return_file(file_name))
            response.headers['Content-Type'] = 'audio/mp3'
            response.headers['Content-Disposition'] = 'attachment; filename=' + file_name + '.mp3'

            return response

        else:
            response = make_response(get_combined_audio(contents_array, jornal, id, type, gender, speed, pitch))
            response.headers['Content-Type'] = 'audio/mp3'
            response.headers['Content-Disposition'] = 'attachment; filename=' + 'sound' + '.mp3'

            return response
    #for tests only
    response = make_response(return_file('sample'))
    response.headers['Content-Type'] = 'audio/mp3'
    response.headers['Content-Disposition'] = 'attachment; filename=' + 'sample' + '.mp3'

    return response
