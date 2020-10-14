from data.repositories import Repository
from data.mongo import MongoFacade
from blueprints.questions import questions_api
from blueprints.images import images_api
from blueprints.caseworker import caseworker_api
from werkzeug.utils import secure_filename
import codecs
import gridfs
import pymongo
from bson import ObjectId
from flask import (
    Flask,
    flash,
    render_template,
    request,
    Response,
    make_response,
    redirect,
    jsonify,
    session,
    url_for,
    send_from_directory,
    send_file
)
import os
import io
import sys
import json
import logging
from logging.config import dictConfig
from urllib.parse import quote_plus
import pprint
from dotenv import load_dotenv
load_dotenv()

# from matching.basic_filter import BasicFilter


ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'psd'}


dictConfig({
    'version': 1,
    'formatters': {'default': {
        'format': '%(message)s',
    }},
    'handlers': {'wsgi': {
        'class': 'logging.StreamHandler',
        'stream': 'ext://sys.stdout',
        'formatter': 'default'
    }},
    'root': {
        'level': 'INFO',
        'handlers': ['wsgi']
    }
})

app = Flask(
    __name__,
    static_url_path='/dist',
    static_folder='app/dist',
    template_folder='app/dist'
)


"""
    BEGIN
"""


# V3
app.register_blueprint(
    questions_api, url_prefix='/api/<org>/<user_type>/registration/<question_type>')
app.register_blueprint(
    images_api, url_prefix='/api/<org>/<user_type>/<user_id>/images/<image_subject>')
app.register_blueprint(
    caseworker_api, url_prefix='/api/<orgname>/caseworkers')

"""
    END
"""


# connect to gunicorn logger if not running directly
if __name__ != '__main__':
    gunicorn_logger = logging.getLogger('gunicorn.error')
    app.logger.handlers = gunicorn_logger.handlers
    app.logger.setLevel(gunicorn_logger.level)


DEBUG = True
MONGO_DATABASE = 'hosthome'


DB_NAME = 'hosthome'


def create_repo(x): return Repository(x, app.logger, DB_NAME)


hostRepository = create_repo('hosts')
accountsRepository = create_repo('accounts')
guestRepository = create_repo('guests')
guestQuestionsRepository = create_repo('guestQuestions')
hostQuestionsRepository = create_repo('hostQuestions')
guestResponsesRepository = create_repo('guestResponses')
hostResponsesRepository = create_repo('hostResponses')
restrictionsRepository = create_repo('restrictions')
responseValuesRepository = create_repo('responseValues')
hostRegisterQuestionsRepository = create_repo('hostRegisterQuestions')
questionBankRepository = create_repo('questionBank')


# TODO: Tyler 5/21/2020: Somebody will need to fix this -- should be
#  in another file, ideally DI of some sort
# .....but definitely not this way
repos = {}

repos['hosts'] = hostRepository
repos['guests'] = guestRepository
repos['guestQuestions'] = guestQuestionsRepository
repos['hostQuestions'] = hostQuestionsRepository
repos['guestResponses'] = guestResponsesRepository
repos['hostResponses'] = hostResponsesRepository
repos['restrictions'] = restrictionsRepository
repos['responseValues'] = responseValuesRepository


# matcher = BasicFilter(repos)


@app.route('/favicon.ico')
def favicon():
    return send_from_directory(
        app.root_path,
        'favicon.ico',
        mimetype='image/vnd.microsoft.icon'
    )


# @app.route('/api/hostQuestions', methods=['GET'])
# def get_all_hostQuestions():

#     app.logger.warning(
#         'get_all_hostQuestions: request.method = {}'.format(request.method))

#     try:

#         hostQuestions = hostQuestionsRepository.get()
#         js = json.dumps(hostQuestions)
#         resp = Response(js, status=200, mimetype='application/json')
#         return resp

#     except Exception as e:

#         data = {
#             'error': str(e)
#         }

#         js = json.dumps(data)
#         resp = Response(js, status=500, mimetype='application/json')

#         return resp


# @app.route('/api/hostQuestions/<int:id>', methods=['GET'])
# def get_hostQuestion_by_id(id: int):

#     app.logger.warning(
#         'get_hostQuestion_by_id: request.method = {}'.format(request.method))

#     try:

#         hostQuestion = hostQuestionsRepository.mongo_facade.get_element_by_id(
#             'hostQuestions', id)
#         js = json.dumps(hostQuestion)
#         resp = Response(js, status=200, mimetype='application/json')
#         return resp

#     except Exception as e:

#         data = {
#             'error': str(e)
#         }

#         js = json.dumps(data)
#         resp = Response(js, status=500, mimetype='application/json')

#         return resp


# @app.route('/api/checkEmail', methods=["POST"])
# def check_by_email():
#     try:
#         req = request.get_json()  # get req from front end
#         accounts = accountsRepository.get_using_email(
#             req['email'])  # pass the req in here when ready
#         if accounts is None:
#             return Response(json.dumps({'error': None, 'status': 400}), status=400, mimetype='application/json')
#         return Response(status=200, mimetype='application/json')

#     except Exception as e:
#         data = {
#             'error': str(e)
#         }

#         js = json.dumps(data)
#         resp = Response(js, status=500, mimetype='application/json')

#         return resp

################
## Guests API ##
################


@app.route('/api/guests', methods=['GET', 'POST'])
def get_all_guests():

    app.logger.warning(
        'get_all_guests: request.method = {}'.format(request.method))

    if request.method == 'GET':

        try:

            guests = guestRepository.get()
            js = json.dumps(guests)
            resp = Response(js, status=200, mimetype='application/json')
            return resp

        except Exception as e:

            data = {
                'error': str(e)
            }

            js = json.dumps(data)
            resp = Response(js, status=500, mimetype='application/json')

            return resp

    elif request.method == 'POST':

        try:

            guest = request.json
            responseData = guestRepository.add(guest)
            app.logger.debug('responseData = {}'.format(responseData))
            resp = Response({'error': None, 'data': None},
                            status=200, mimetype='application/json')
            return resp

        except Exception as e:

            data = {
                'error': str(e)
            }

            js = json.dumps(data)
            resp = Response(js, status=500, mimetype='application/json')

            return resp

    else:

        app.logger.debug(f'what is {request.method} even doing here.')


@app.route('/api/guests/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def guest_by_id(id: int):

    app.logger.warning(
        'guest_by_id: request.method = {}'.format(request.method))
    app.logger.warning(f'guest_by_id: id = {id} ({type(id)})')

    if request.method == 'GET':

        try:

            guest = guestRepository.mongo_facade.get_element_by_id(
                'guests', id)
            js = json.dumps(guest)
            resp = Response(js, status=200, mimetype='application/json')
            return resp

        except Exception as e:

            data = {
                'error': str(e)
            }

            js = json.dumps(data)
            resp = Response(js, status=500, mimetype='application/json')

            return resp

    elif request.method == 'PUT':

        try:

            responseData = guestRepository.update(id, request.json)
            app.logger.debug('responseData = {}'.format(responseData))
            resp = Response(json.dumps({'error': None, 'data': None}),
                            status=200, mimetype='application/json')
            return resp

        except Exception as e:

            data = {
                'error': str(e)
            }

            js = json.dumps(data)
            resp = Response(js, status=500, mimetype='application/json')

            return resp

    elif request.method == 'DELETE':

        try:

            responseData = guestRepository.delete(id)
            app.logger.debug('responseData = {}'.format(responseData))
            resp = Response(json.dumps({'error': None, 'data': None}),
                            status=200, mimetype='application/json')
            return resp

        except Exception as e:

            data = {
                'error': str(e)
            }

            js = json.dumps(data)
            resp = Response(js, status=500, mimetype='application/json')

            return resp

    else:

        app.logger.debug(f'what is {request.method} even doing here.')


@app.route('/api/guestQuestions', methods=['GET'])
def get_all_guestQuestions():

    app.logger.warning(
        'get_all_guestQuestions: request.method = {}'.format(request.method))

    try:

        guestQuestions = guestQuestionsRepository.get()
        js = json.dumps(guestQuestions)
        resp = Response(js, status=200, mimetype='application/json')
        return resp

    except Exception as e:

        data = {
            'error': str(e)
        }

        js = json.dumps(data)
        resp = Response(js, status=500, mimetype='application/json')

        return resp


@app.route('/api/guestQuestions/<int:id>', methods=['GET'])
def get_guestQuestion_by_id(id: int):

    app.logger.warning(
        'get_guestQuestion_by_id: request.method = {}'.format(request.method))

    try:

        guestQuestion = guestQuestionsRepository.mongo_facade.get_element_by_id(
            'guestQuestions', id)
        js = json.dumps(guestQuestion)
        resp = Response(js, status=200, mimetype='application/json')
        return resp

    except Exception as e:

        data = {
            'error': str(e)
        }

        js = json.dumps(data)
        resp = Response(js, status=500, mimetype='application/json')

        return resp


@app.route('/api/guests/<int:guest_id>/responses', methods=['GET', 'POST'])
def get_guest_responses(guest_id: int):

    app.logger.warning(
        'get_guest_responses: request.method = {}'.format(request.method))
    app.logger.warning(f'guest_by_id: id = {guest_id} ({type(guest_id)})')

    if request.method == 'GET':

        try:

            guestResponses = guestResponsesRepository.get()
            guestResponses = [response for response in guestResponses
                              if response['guestId'] == guest_id]
            js = json.dumps(guestResponses)
            resp = Response(js, status=200, mimetype='application/json')
            return resp

        except Exception as e:

            data = {
                'error': str(e)
            }

            js = json.dumps(data)
            resp = Response(js, status=500, mimetype='application/json')

            return resp

    elif request.method == 'POST':

        try:

            guest_response = request.json
            responseData = guestResponsesRepository.add(guest_response)
            app.logger.debug('responseData = {}'.format(responseData))
            resp = Response({'error': None, 'data': None},
                            status=200, mimetype='application/json')

            return resp

        except Exception as e:

            data = {
                'error': str(e)
            }

            js = json.dumps(data)
            resp = Response(js, status=500, mimetype='application/json')

            return resp

    else:

        app.logger.debug(f'what is {request.method} even doing here.')


@app.route('/api/guests/<int:guest_id>/responses/<int:question_id>', methods=['GET', 'PUT', 'DELETE'])
def get_guest_response_by_id(guest_id: int, question_id: int):

    app.logger.warning(
        'get_guest_response_by_id: request.method = {}'.format(request.method))

    if request.method == 'GET':

        try:

            guestResponses = guestResponsesRepository.get()
            guestResponses = [response['responseValues'] for response in guestResponses
                              if response['guestId'] == guest_id and response['questionId'] == question_id]
            js = json.dumps(guestResponses[0])
            resp = Response(js, status=200, mimetype='application/json')
            return resp

        except Exception as e:

            data = {
                'error': str(e)
            }

            js = json.dumps(data)
            resp = Response(js, status=500, mimetype='application/json')

            return resp

    elif request.method == 'PUT':

        try:

            guestResponses = guestResponsesRepository.get()
            response_id = [response['responseValues'] for response in guestResponses
                           if response['guestId'] == guest_id and
                           response['questionId'] == question_id][0]

            # this is really shaky, need to know what's being passed back
            # needs guest_id and question_id
            responseData = guestResponsesRepository.update(
                response_id, request.json)
            app.logger.debug('responseData = {}'.format(responseData))
            resp = Response(json.dumps({'error': None, 'data': None}),
                            status=200, mimetype='application/json')
            return resp

        except Exception as e:

            data = {
                'error': str(e)
            }

            js = json.dumps(data)
            resp = Response(js, status=500, mimetype='application/json')

            return resp

    elif request.method == 'DELETE':

        try:
            guestResponses = guestResponsesRepository.get()
            response_id = [response['responseValues'] for response in guestResponses
                           if response['guestId'] == guest_id and
                           response['questionId'] == question_id][0]

            responseData = guestResponsesRepository.delete(guest_id)
            app.logger.debug('responseData = {}'.format(responseData))
            resp = Response(json.dumps({'error': None, 'data': None}),
                            status=200, mimetype='application/json')
            return resp

        except Exception as e:

            data = {
                'error': str(e)
            }

            js = json.dumps(data)
            resp = Response(js, status=500, mimetype='application/json')

            return resp

    else:

        app.logger.debug(f'what is {request.method} even doing here.')


@app.route('/api/hosts/<int:host_id>/responses', methods=['GET', 'POST'])
def get_host_responses(host_id: int):

    app.logger.warning(
        'get_host_responses: request.method = {}'.format(request.method))
    app.logger.warning(f'host_by_id: id = {host_id} ({type(host_id)})')

    if request.method == 'GET':

        try:

            hostResponses = hostResponsesRepository.get()
            hostResponses = [response for response in hostResponses
                             if response['hostId'] == host_id]
            js = json.dumps(hostResponses)
            resp = Response(js, status=200, mimetype='application/json')
            return resp

        except Exception as e:

            data = {
                'error': str(e)
            }

            js = json.dumps(data)
            resp = Response(js, status=500, mimetype='application/json')

            return resp

    elif request.method == 'POST':

        try:

            host_response = request.json
            responseData = hostResponsesRepository.add(host_response)
            app.logger.debug('responseData = {}'.format(responseData))
            resp = Response({'error': None, 'data': None},
                            status=200, mimetype='application/json')

            return resp

        except Exception as e:

            data = {
                'error': str(e)
            }

            js = json.dumps(data)
            resp = Response(js, status=500, mimetype='application/json')

            return resp

    else:

        app.logger.debug(f'what is {request.method} even doing here.')


@app.route('/api/hosts/<int:host_id>/responses/<int:question_id>', methods=['GET', 'PUT', 'DELETE'])
def get_host_response_by_id(host_id: int, question_id: int):

    app.logger.warning(
        'get_host_response_by_id: request.method = {}'.format(request.method))

    if request.method == 'GET':

        try:

            hostResponses = hostResponsesRepository.get()
            hostResponses = [response['responseValues'] for response in hostResponses
                             if response['hostId'] == host_id and response['questionId'] == question_id]
            js = json.dumps(hostResponses[0])
            resp = Response(js, status=200, mimetype='application/json')
            return resp

        except Exception as e:

            data = {
                'error': str(e)
            }

            js = json.dumps(data)
            resp = Response(js, status=500, mimetype='application/json')

            return resp

    elif request.method == 'PUT':

        try:

            hostResponses = hostResponsesRepository.get()
            response_id = [response['responseValues'] for response in hostResponses
                           if response['hostId'] == host_id and
                           response['questionId'] == question_id][0]

            # this is really shaky, need to know what's being passed back
            # needs host_id and question_id
            responseData = hostResponsesRepository.update(
                response_id, request.json)
            app.logger.debug('responseData = {}'.format(responseData))
            resp = Response(json.dumps({'error': None, 'data': None}),
                            status=200, mimetype='application/json')
            return resp

        except Exception as e:

            data = {
                'error': str(e)
            }

            js = json.dumps(data)
            resp = Response(js, status=500, mimetype='application/json')

            return resp

    elif request.method == 'DELETE':

        try:
            hostResponses = hostResponsesRepository.get()
            response_id = [response['responseValues'] for response in hostResponses
                           if response['hostId'] == host_id and
                           response['questionId'] == question_id][0]

            responseData = hostResponsesRepository.delete(host_id)
            app.logger.debug('responseData = {}'.format(responseData))
            resp = Response(json.dumps({'error': None, 'data': None}),
                            status=200, mimetype='application/json')
            return resp

        except Exception as e:

            data = {
                'error': str(e)
            }

            js = json.dumps(data)
            resp = Response(js, status=500, mimetype='application/json')

            return resp

    else:

        app.logger.debug(f'what is {request.method} even doing here.')


@app.route('/api/restrictions', methods=['GET'])
def get_all_restrictions():

    app.logger.warning(
        'all_restrictions: request.method = {}'.format(request.method))

    try:

        restrictions = restrictionsRepository.get()
        js = json.dumps(restrictions)
        resp = Response(js, status=200, mimetype='application/json')

        return resp

    except Exception as e:

        data = {
            'error': str(e)
        }

        js = json.dumps(data)
        resp = Response(js, status=500, mimetype='application/json')

        return resp


@app.route('/api/responseValues', methods=['GET'])
def get_all_response_values():

    try:
        responseValues = responseValuesRepository.get()
        js = json.dumps(responseValues)
        resp = Response(js, status=200, mimetype='application/json')
        return resp

    except Exception as e:

        data = {
            'error': str(e)
        }

        js = json.dumps(data)
        resp = Response(js, status=500, mimetype='application/json')
        return resp


# TODO: Mark for deprecation! no need to dl the whole set for any view in the app

@app.route('/api/dataset', methods=['GET'])
def get_all_data():

    try:

        hosts = hostRepository.get()
        guests = guestRepository.get()
        guestQuestions = guestQuestionsRepository.get()
        hostQuestions = hostQuestionsRepository.get()
        guestResponses = guestResponsesRepository.get()
        hostResponses = hostResponsesRepository.get()
        responseValues = responseValuesRepository.get()
        restrictions = restrictionsRepository.get()

        data = {
            'hosts': hosts,
            'guests': guests,
            'guestQuestions': guestQuestions,
            'hostQuestions': hostQuestions,
            'guestResponses': guestResponses,
            'hostResponses': hostResponses,
            'responseValues': responseValues,
            'restrictions': restrictions,
            'matchResults': []
        }

        js = json.dumps(data)
        resp = Response(js, status=200, mimetype='application/json')
        return resp

    except Exception as e:
        data = {
            'test': 'failed',
            'error': str(e)
        }

        js = json.dumps(data)
        resp = Response(js, status=500, mimetype='application/json')
        return resp


def _populate_children(question):

    children = question['children']

    if question['_id'] == '5f0e62f5769aab8c53ac04ff':
        return question

    if not children:
        return question
    else:
        for key, childs in children.items():
            populated_children = []

            # PREPARE FOR UGLINESS!
            # will fix this - stupid data modeling dumbness
            # have child values as list sometimes and as id...

            if type(childs) is str:
                child_question = hostRegisterQuestionsRepository.get_by_id(
                    childs)
                child_question = _populate_children(child_question)
                populated_children.append(child_question)
                question['children'][key] = populated_children

            elif type(childs) is list:

                for child in childs:
                    if type(child) is list:
                        continue
                    child_question = hostRegisterQuestionsRepository.get_by_id(
                        child)
                    child_question = _populate_children(child_question)
                    populated_children.append(child_question)

                question['children'][key] = populated_children
            else:
                app.logger.debug(f'No clue why type is {type(childs)}')

        return question


@app.route('/api/v1/hostRegisterQuestions', methods=['GET'])
def get_host_register_questions():

    try:
        response = hostRegisterQuestionsRepository.get(
            sort_condition=[("order", pymongo.ASCENDING)])

        data = [_populate_children(question) for question in response]

        # Sample model from client proto
        # {
        #     id: '10',
        #     type: 'radio',
        #     group: 'Introductory Questions',
        #     order: -50,
        #     question: 'Do you have an extra bedroom or private space in their home?',
        #     options: [{label: 'Yes', value: 'yes'}, {label: 'No', value: 'no'}],
        # },

        # data = [{
        #    'id': q['_id'],
        #    'type': 'radio',
        #    'group': 'MatchingQuestions',
        #    'order': i,
        #    'question': q['text'],
        #    'options': [
        #        opt['text'] for opt in responseValues if opt['id'] in q['responseValues']
        #    ]
        # } for (i, q) in enumerate(hostQuestions)]

        js = json.dumps(data)
        resp = Response(js, status=200, mimetype='application/json')
        return resp

    except Exception as e:
        data = {
            'test': 'failed',

            'error': str(e)
        }

        js = json.dumps(data)
        resp = Response(js, status=500, mimetype='application/json')
        return resp


@app.route('/api/v1/hostRegisterQuestions/<question_id>', methods=['GET', 'PUT', 'DELETE'])
def get_host_register_question_by_id(question_id):

    if request.method == 'GET':

        try:
            data = hostRegisterQuestionsRepository.get_by_id(question_id)
            js = json.dumps(data)
            resp = Response(js, status=200, mimetype='application/json')
            return resp

        except Exception as e:
            data = {
                'test': 'failed',

                'error': str(e)
            }

            js = json.dumps(data)
            resp = Response(js, status=500, mimetype='application/json')
            return resp

    elif request.method == 'PUT':

        try:
            responseData = hostRegisterQuestionsRepository.update(
                question_id, request.json)
            app.logger.debug('responseData = {}'.format(responseData))
            resp = Response(json.dumps({'error': None, 'data': None}),
                            status=200, mimetype='application/json')
            return resp

        except Exception as e:

            data = {
                'error': str(e)
            }

            js = json.dumps(data)
            resp = Response(js, status=500, mimetype='application/json')

            return resp

    elif request.method == 'DELETE':

        try:

            responseData = hostRegisterQuestionsRepository.delete(question_id)
            app.logger.debug('responseData = {}'.format(responseData))
            resp = Response(json.dumps({'error': None, 'data': None}),
                            status=200, mimetype='application/json')
            return resp

        except Exception as e:

            data = {
                'error': str(e)
            }

            js = json.dumps(data)
            resp = Response(js, status=500, mimetype='application/json')

            return resp

    else:

        app.logger.debug(f'what is {request.method} even doing here.')

        pass


# TODO: Mark for deprecation! no need to dl the whole set for any view in the app

@app.route('/api/v1/questions', methods=['GET'])
def get_questions_v1():

    try:
        hostQuestions = hostQuestionsRepository.get()
        responseValues = responseValuesRepository.get()

        # Sample model from client proto
        # {
        #     id: '10',
        #     type: 'radio',
        #     group: 'Introductory Questions',
        #     order: -50,
        #     question: 'Do you have an extra bedroom or private space in their home?',
        #     options: [{label: 'Yes', value: 'yes'}, {label: 'No', value: 'no'}],
        # },

        data = [{
            'id': q['_id'],
            'type': 'radio',
            'group': 'MatchingQuestions',
            'order': i,
            'question': q['text'],
            'options': [
                opt['text'] for opt in responseValues if opt['id'] in q['responseValues']
            ]
        } for (i, q) in enumerate(hostQuestions)]

        js = json.dumps(data)
        resp = Response(js, status=200, mimetype='application/json')
        return resp

    except Exception as e:
        data = {
            'test': 'failed',

            'error': str(e)
        }

        js = json.dumps(data)
        resp = Response(js, status=500, mimetype='application/json')
        return resp


@app.route('/api/matchResults', methods=['GET'])
def get_all_match_results():

    try:

        # match_results = matcher.get_all_match_results()
        match_results = []

        js = json.dumps(match_results)
        resp = Response(js, status=200, mimetype='application/json')

        return resp

    except Exception as e:

        data = {
            'test': 'failed',
            'error': str(e)
        }

        js = json.dumps(data)
        resp = Response(js, status=500, mimetype='application/json')
        return resp


# @app.route('/api/v1/questions/host/matching', methods=['GET'])
# def get_host_matching_questions():
#     pass


# @app.route('/api/v1/questions/host/qualifying', methods=['GET'])
# def get_host_qualifying_questions():
#     pass


#########################
#image upload test route#
#########################

def allowed_file(filename):
    if not "." in filename:
        return False

    ext = filename.rsplit(".", 1)[1]

    if ext.lower() in ALLOWED_EXTENSIONS:
        return True
    else:
        return False


@app.route('/api/uploadImage', methods=['POST'])
def image_upload():
    if 'image' not in request.files:
        flash('no image file')
        return Response(status=400, mimetype='application/json')

    app.logger.debug(f'image_upload(): request.form: {request.form}')
    email = request.form['email']
    subject = request.form['subject']
    img = request.files["image"]

    file_type = img.content_type

    app.logger.debug(f'image_upload(): img.content_type: {img.content_type}')
    app.logger.debug(f'image_upload(): img.mimetype: {img.mimetype}')
    app.logger.debug(f'image_upload(): img.filename: {img.filename}')
    if img.filename == '':
        flash('no image was selected')
        return Response(status=400, mimetype='application/json')

    if img and allowed_file(img.filename):
        img_name = secure_filename(img.filename)
        saveImg = MongoFacade(app.logger, DB_NAME)
        resp = saveImg.save_file(img, img_name, subject, email, file_type)
        if resp is not None:
            return Response(json.dumps({'msg': 'Image saved successfully', 'status': 200}), status=200, mimetype='application/json')
        else:
            return Response(status=500, mimetype='application/json')
    else:
        return Response(status=500, mimetype='application/json')

    return Response(status=200, mimetype='application/json')


@app.route('/api/host/images/<subject>', methods=['POST'])
def get_images(subject):
    try:

        email = request.json['email']

        app.logger.debug(
            f'get_images: looking for {subject} photos for {email}')

        mongo = MongoFacade(app.logger, DB_NAME)

        records = mongo.get_files_for_user_with_subject(email, subject)

        result = []
        app.logger.debug(f'get_images: records')

        for r in records:

            app.logger.debug(f'get_images: - r: {r}')
            result.append({
                'id': str(r._id),
                'filename': r.filename
            })

        return jsonify(result)

        # return Response(result, status=200, mimetype='application/json')
    except Exception as e:
        app.logger.error(f'get_images: error: {e}')
        return Response({'error': e}, status=500, mimetype='application/json')


@app.route('/api/host/images/download/<file_id>', methods=['GET'])
def image_download(file_id):

    app.logger.debug(f'image_download: file_id = {file_id}')

    try:
        mongo = MongoFacade(app.logger, DB_NAME)
        img = mongo.load_file(file_id)
        app.logger.debug(f'image_download: img.filename = {img.filename}')
        app.logger.debug(
            f'image_download: img.content_type = {img.content_type}')
        return send_file(
            io.BytesIO(img.read()),
            mimetype=img.content_type,
            as_attachment=True,
            attachment_filename=img.filename
        )
    except Exception as e:
        return Response(f'Error: {e}', status=500, mimetype='text/plain')
# 5f57271622830a20c4c5b87f


# @app.route('/api/host/images/home', methods=['POST'])
# def host_home_images():

#     email = request.json['email']

#     try:
#         mongo = MongoFacade(app.logger, DB_NAME)
#         img = mongo.load_file(email)
#         return send_file(
#             io.BytesIO(img),
#             mimetype='image/jpeg',
#             as_attachment=True,
#             attachment_filename='%s.jpg' % pid
#         )
#     except Exception as e:
#         return Response(f'Error: {e}', status=500, mimetype='text/plain')


"""
  *****
    HOST REGISTRATION: DEDICATED ROUTES
  *****
"""


@app.route('/api/account/type', methods=['POST'])
def get_user_type():
    """Returns user type"""

    try:

        data = request.json
        if 'email' not in data:
            raise Exception('Email must be included in POST request body')

        app.logger.debug(f'get_user_type(): data: {data}')
        mf = MongoFacade(app.logger, DB_NAME)

        if mf.item_in_collection('hosts', 'email', data['email']):
            return Response(json.dumps({'type': 'host'}), status=200, mimetype='application/json')
        elif mf.item_in_collection('guests', 'email', data['email']):
            return Response(json.dumps({'type': 'host'}), status=200, mimetype='application/json')
        else:
            return Response(json.dumps({'type': 'none'}), status=200, mimetype='application/json')

    except Exception as e:
        app.logger.error(f'get_user_type: error : {str(e)}')

        return Response(json.dumps({'error': str(e)}), status=500, mimetype='application/json')


@app.route('/api/host', methods=['POST'])
def get_host_by_email():
    """Returns user type"""

    try:

        data = request.json
        if 'email' not in data:
            raise Exception('Email must be included in POST request body')

        app.logger.debug(f'get_user_type(): data: {data}')
        mf = MongoFacade(app.logger, DB_NAME)

        if not mf.item_in_collection('hosts', 'email', data['email']):
            return Response(f'No host with email: {data["email"]}', status=400, mimetype='text/plain')

        host = mf.get_user_by_email('hosts', data['email'])

        return Response(json.dumps(host), status=200, mimetype='application/json')

    except Exception as e:
        app.logger.error(f'get_user_type: error : {str(e)}')

        return Response(json.dumps({'error': str(e)}), status=500, mimetype='application/json')


@app.route('/api/host/registration', methods=['POST'])
def add_new_host():
    """Add a host"""

    try:

        data = request.json
        if 'email' not in data:
            raise Exception('Email must be included in POST request body')

        app.logger.debug(f'add_new_host(): data: {data}')
        mf = MongoFacade(app.logger, DB_NAME)

        if mf.item_in_collection('hosts', 'email', data['email']):
            return Response(f'Existing account with email: {data["email"]}', status=400, mimetype='text/plain')

        mf.insert_to_collection('hosts', data)

        return Response(status=200, mimetype='application/json')

    except Exception as e:
        app.logger.error(f'add_new_host: error adding data: {str(e)}')

        return Response(json.dumps({'error': str(e)}), status=500, mimetype='application/json')


@app.route('/api/host/registration/info', methods=['PUT'])
def add_host_info():
    """Add the general info for a host"""

    try:

        data = request.json
        app.logger.debug(f'add_host_info(): data: {data}')
        mf = MongoFacade(app.logger, DB_NAME)
        mf.add_field_to_record('hosts', 'email', data['email'], 'info', data)
        return Response(status=200, mimetype='application/json')

    except Exception as e:
        app.logger.error(f'add_host_info: error adding data: {str(e)}')
        return Response(json.dumps({'error': str(e)}), status=500, mimetype='application/json')


# Tyler 8/30/2020
# TODO: should we use a generic route like this ot support all bio fields?
# @app.route('/api/host/registration/bio/<field_name>', methods=['PUT'])
# def add_host_bio_field(field_name):
#     """Adds a field to a host record"""

#     try:

#         data = request.json
#         app.logger.debug(f'add_host_contact(): data: {data}')
#         mf = MongoFacade(app.logger, DB_NAME)
#         mf.add_field_to_record(
#             'hosts', 'email', data['email'], field_name, data)
#         return Response(status=200, mimetype='application/json')

#     except Exception as e:
#         app.logger.error(f'add_host_contact: error adding data: {str(e)}')
#         return Response(json.dumps({'error': str(e)}), status=500, mimetype='application/json')


@app.route('/api/host/registration/contact', methods=['PUT'])
def add_host_contact():
    """Add the contact info for a host"""

    try:

        data = request.json
        app.logger.debug(f'add_host_contact(): data: {data}')
        mf = MongoFacade(app.logger, DB_NAME)
        mf.add_field_to_record(
            'hosts', 'email', data['email'], 'contact', data)
        return Response(json.dumps({}), status=200, mimetype='application/json')

    except Exception as e:
        app.logger.error(f'add_host_contact: error adding data: {str(e)}')
        return Response(json.dumps({'error': str(e)}), status=500, mimetype='application/json')


@app.route('/api/host/registration/address', methods=['PUT'])
def add_host_address():
    """Add the address info for a host"""

    try:

        data = request.json
        app.logger.debug(f'add_host_address(): data: {data}')
        mf = MongoFacade(app.logger, DB_NAME)
        mf.add_field_to_record(
            'hosts', 'email', data['email'], 'address', data)
        return Response(json.dumps({}), status=200, mimetype='application/json')

    except Exception as e:
        app.logger.error(f'add_host_address: error adding data: {str(e)}')
        return Response(json.dumps({'error': str(e)}), status=500, mimetype='application/json')


@app.route('/api/host/registration/language', methods=['PUT'])
def add_host_language():
    """Add the language info for a host"""

    try:

        data = request.json
        app.logger.debug(f'add_host_language(): data: {data}')
        mf = MongoFacade(app.logger, DB_NAME)
        mf.add_field_to_record(
            'hosts', 'email', data['email'], 'language', data)
        return Response(json.dumps({}), status=200, mimetype='application/json')

    except Exception as e:
        app.logger.error(f'add_host_language: error adding data: {str(e)}')
        return Response(json.dumps({'error': str(e)}), status=500, mimetype='application/json')


@app.route('/api/host/registration/gender', methods=['PUT'])
def add_host_gender():
    """Add the gender info for a host"""

    try:

        data = request.json
        app.logger.debug(f'add_host_gender(): data: {data}')
        mf = MongoFacade(app.logger, DB_NAME)
        mf.add_field_to_record(
            'hosts', 'email', data['email'], 'gender', data)
        return Response(json.dumps({}), status=200, mimetype='application/json')

    except Exception as e:
        app.logger.error(f'add_host_gender: error adding data: {str(e)}')
        return Response(json.dumps({'error': str(e)}), status=500, mimetype='application/json')


@app.route('/api/host/registration/matching/<questionId>', methods=['PUT'])
def add_host_matching_response(questionId):
    """Add the a response to a host matching question"""

    try:

        data = request.json
        app.logger.debug(f'add_host_matching_response(): data: {data}')
        mf = MongoFacade(app.logger, DB_NAME)
        mf.add_field_to_record_child(
            'hosts', 'email', data['email'], 'matchingResponses', questionId, data['response'])

        return Response(json.dumps({}), status=200, mimetype='application/json')

    except Exception as e:
        app.logger.error(
            f'add_host_matching_response: error adding data: {str(e)}')
        return Response(json.dumps({'error': str(e)}), status=500, mimetype='application/json')


@app.route('/api/host/registration/qualifying/<questionId>', methods=['PUT'])
def add_host_qualifying_response(questionId):
    """Add the a response to a host qualifying question"""

    try:
        data = request.json
        app.logger.debug(f'add_host_qualifying_response(): data: {data}')
        mf = MongoFacade(app.logger, DB_NAME)
        mf.add_field_to_record_child(
            'hosts', 'email', data['email'], 'qualifyingResponses', questionId, data['response'])

        return Response(json.dumps({}), status=200, mimetype='application/json')

    except Exception as e:
        app.logger.error(
            f'add_host_qualifying_response: error adding data: {str(e)}')
        return Response(json.dumps({'error': str(e)}), status=500, mimetype='application/json')


@app.route('/api/questions/<user_type>/registration/matching/<question_id>/options', methods=['POST'])
def add_response_option(user_type, question_id):
    """Add a response option to a matching question"""

    try:
        data = request.json
        app.logger.debug(f'add_response_option(): data: {data}')
        mf = MongoFacade(app.logger, DB_NAME)

        mf.add_to_child_collection(
            'matchingQuestions', question_id, 'options', data)

        return Response(json.dumps({}), status=200, mimetype='application/json')

    except Exception as e:
        app.logger.error(
            f'add_response_option: error adding data: {str(e)}')
        return Response(json.dumps({'error': str(e)}), status=500, mimetype='application/json')


@app.route('/api/v1/questions/host/qualifying', methods=['GET'])
@app.route('/api/host/registration/qualifying', methods=['GET'])
def get_host_qualifying_questions():
    """Get all host qualifying questions"""

    try:

        mf = MongoFacade(app.logger, DB_NAME)
        questions = mf.get_collection('qualifyingQuestions', None)

        return jsonify(questions)

    except Exception as e:
        app.logger.error(
            f'get_host_qualifying_questions: error getting data: {str(e)}')
        return Response(json.dumps({'error': str(e)}), status=500, mimetype='application/json')


@app.route('/api/v1/questions/host/matching', methods=['GET'])
@app.route('/api/host/registration/matching', methods=['GET'])
def get_host_matching_questions():
    """Get all host matching questions"""

    try:

        mf = MongoFacade(app.logger, DB_NAME)
        questions = mf.get_collection('matchingQuestions', None)

        return jsonify(questions)

    except Exception as e:
        app.logger.error(
            f'get_host_matching_questions: error getting data: {str(e)}')
        return Response(json.dumps({'error': str(e)}), status=500, mimetype='application/json')


@app.route('/api/host/registration/info', methods=['GET'])
def get_host_info_questions():
    """Get all host info questions"""

    try:

        mf = MongoFacade(app.logger, DB_NAME)
        questions = mf.get_collection('infoQuestions', None)

        return jsonify(questions)

    except Exception as e:
        app.logger.error(
            f'get_host_matching_questions: error getting data: {str(e)}')
        return Response(json.dumps({'error': str(e)}), status=500, mimetype='application/json')


@app.route('/api/questions/<user_type>/registration/<question_type>/<question_id>', methods=['DELETE'])
def delete_question(user_type, question_type, question_id):
    """Delete a question"""

    try:
        app.logger.debug(f'delete_question():')
        app.logger.debug(f'- user_type= {user_type}')
        app.logger.debug(f'- question_type= {question_type}')
        app.logger.debug(f'- question_id= {question_id}')

        mf = MongoFacade(app.logger, DB_NAME)

        mf.delete_from_collection(
            f'{question_type.lower()}Questions', question_id)

        return Response(json.dumps({}), status=200, mimetype='application/json')

    except Exception as e:
        app.logger.error(
            f'delete_question: error deleting data: {str(e)}')
        return Response(json.dumps({'error': str(e)}), status=500, mimetype='application/json')


@app.route('/api/questions/<user_type>/registration/<question_type>', methods=['POST'])
def add_question(user_type, question_type):
    """Add a question"""

    try:

        data = request.json

        app.logger.debug(f'add_question():')
        app.logger.debug(f'- user_type= {user_type}')
        app.logger.debug(f'- question_type= {question_type}')
        app.logger.debug(f'- data= {data}')

        mf = MongoFacade(app.logger, DB_NAME)

        mf.insert_to_collection(
            f'{question_type.lower()}Questions', data)

        return Response(json.dumps({}), status=200, mimetype='application/json')

    except Exception as e:
        app.logger.error(
            f'add_question: error adding data: {str(e)}')
        return Response(json.dumps({'error': str(e)}), status=500, mimetype='application/json')


@app.route('/api/questions/<user_type>/registration/<question_type>/<question_id>', methods=['PUT'])
def update_question(user_type, question_type, question_id):
    """Update a question"""

    try:

        data = request.json

        app.logger.debug(f'add_question():')
        app.logger.debug(f'- user_type= {user_type}')
        app.logger.debug(f'- question_type= {question_type}')
        app.logger.debug(f'- data= {data}')

        question = {}
        for k, v in dict(data).items():
            if k != '_id':
                question[k] = v
        mf = MongoFacade(app.logger, DB_NAME)

        mf.update_in_collection(
            f'{question_type.lower()}Questions', question_id, question)

        return Response(json.dumps({}), status=200, mimetype='application/json')

    except Exception as e:
        app.logger.error(
            f'add_question: error adding data: {str(e)}')
        return Response(json.dumps({'error': str(e)}), status=500, mimetype='application/json')


@app.route('/api/questions/<user_type>/registration/<question_type>/<question_id>/options/<response_option_id>', methods=['PUT'])
def update_response_option(user_type, question_type, question_id, response_option_id):
    """Update a response options"""
    try:

        data = request.json

        app.logger.debug(f'update_response_option():')
        app.logger.debug(f'- user_type= {user_type}')
        app.logger.debug(f'- question_type= {question_type}')
        app.logger.debug(f'- question_id= {question_id}')
        app.logger.debug(f'- response_option_id= {response_option_id}')
        app.logger.debug(f'- data= {data}')

        mf = MongoFacade(app.logger, DB_NAME)

        mf.update_in_child_collection(
            f'{question_type.lower()}Questions', question_id, 'options', data)

        return Response(json.dumps({}), status=200, mimetype='application/json')

    except Exception as e:
        app.logger.error(
            f'update_response_option: error adding data: {str(e)}')
        return Response(json.dumps({'error': str(e)}), status=500, mimetype='application/json')


@ app.route('/', defaults={'path': ''})
@ app.route('/<path:path>')
def index(path):
    app.logger.debug(
        "quote_plus(os.getenv('DB_USER')) = {}".format(os.getenv('DB_USER')))
    app.logger.debug(
        "quote_plus(os.getenv('DB_PWD')) = {}".format(os.getenv('DB_PWD')))
    app.logger.debug("os.getenv('DB_HOST') = {}".format(os.getenv('DB_HOST')))
    app.logger.debug("os.getenv('DB_PORT') = {}".format(os.getenv('DB_PORT')))
    app.logger.warning('path = {}'.format(path))
    return app.send_static_file("index.html")


if __name__ == "__main__":
    handler = logging.StreamHandler(sys.stdout)
    app.logger.addHandler(handler)
    app.logger.setLevel(logging.DEBUG)
    app.logger.warning('starting app...')

    app.run(host="0.0.0.0", port=8080, debug=True)
