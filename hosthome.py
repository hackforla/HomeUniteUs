import os
import sys
import json
import logging
from logging.config import dictConfig
from urllib.parse import quote_plus

from dotenv import load_dotenv
load_dotenv()

from flask import (
    Flask,
    render_template,
    request,
    Response,
    make_response,
    redirect,
    jsonify,
    session,
    url_for,
    send_from_directory
)
from bson import ObjectId
import pymongo


from matching.basic_filter import BasicFilter


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


# connect to gunicorn logger if not running directly
if __name__ != '__main__':
    gunicorn_logger = logging.getLogger('gunicorn.error')
    app.logger.handlers = gunicorn_logger.handlers
    app.logger.setLevel(gunicorn_logger.level)


DEBUG = True
MONGO_DATABASE = 'hosthome'


class MongoFacade:

    def __init__(self):

        if DEBUG:

            self.url = 'mongodb://{}:{}'.format(
                os.getenv('DB_HOST'),
                os.getenv('DB_PORT')
            )

        else:
            self.url = 'mongodb://{}:{}@{}:{}'.format(
                quote_plus(os.getenv('DB_USER')),
                quote_plus(os.getenv('DB_PWD')),
                os.getenv('DB_HOST'),
                os.getenv('DB_PORT')
            )

    def _get_conn(self):
        client = pymongo.MongoClient(self.url)
        try:
            # The ismaster command is cheap and does not require auth.
            client.admin.command('ismaster')
            return client
        except Exception as e:
            app.logger.debug("Server not available: {}".format(e))
            raise e

    def get_collection(self, collection_name):

        self._log('get_collection', 'acquiring connection...')

        client = self._get_conn()

        db = client[MONGO_DATABASE]
        collection = db[collection_name]
        cursor = collection.find()
        items = list(cursor)

        for item in items:
            item['_id'] = str(item['_id'])

        self._log('get_collection', 'items = {}'.format(items))
        return items


    def get_element_by_id(self, collection_name, id):

        self._log('get_element_by_id', 'acquiring connection...')

        client = self._get_conn()

        db = client[MONGO_DATABASE]
        collection = db[collection_name]
        item = collection.find_one({'id': id})
        item['_id'] = str(item['_id']) # repeating this as above, but seems bad...

        self._log('get_collection', 'item = {}'.format(item))
        return item
    ###########################################################attempt
    def get_user_by_email(self, collection_name, email): #need to add param called email here
        try:
            self._log('get_user_by_email', 'acquiring connection...')
            client = self._get_conn()
            db = client[MONGO_DATABASE]
            collection = db[collection_name]

            user = collection.find_one({ 'email': email }) #email needs to be replace with request body
            if user is None:
                return None
            user['_id'] = str(user['_id'])
            self._log('get_collections', 'items = {}'.format(user))
            return user
        except Exception as e:
            self._log("get_user_by_email", f"error {e}")
            raise e

    #####################################################################

    def insert_to_collection(self, collection_name, item):
        client = self._get_conn()

        db = client[MONGO_DATABASE]
        collection = db[collection_name]

        result = collection.insert_one(item).inserted_id

        return result

    def delete_from_collection(self, collection_name, id):
        client = self._get_conn()

        if not client:
            raise Exception('Mongo server not available')

        db = client[MONGO_DATABASE]
        collection = db[collection_name]

        result = collection.delete_one({'id':id})
        self._log('delete_from_collection', 'result.raw_result = {}'.format(result.raw_result))

        return result

    def update_in_collection(self, collection_name, id, item):

        app.logger.warning('MongoFacade:update_in_collection(): id = {} ({})'.format(id, type(id)))
        app.logger.warning('MongoFacade:update_in_collection(): item = {}'.format(item))
        app.logger.warning('MongoFacade:update_in_collection(): collection_name = {}'.format(collection_name))

        client = self._get_conn()

        if not client:
            app.logger.error('MongoFacade:update_in_collection(): Mongo server not available')
            raise Exception('Mongo server not available')

        app.logger.warning(f'MongoFacade:update_in_collection(): getting DB {MONGO_DATABASE}...')
        db = client[MONGO_DATABASE]

        app.logger.warning(f'MongoFacade:update_in_collection(): getting collection {collection_name}...')
        collection = db[collection_name]

        app.logger.warning(f'MongoFacade:update_in_collection(): updating item in collection...')
        result = collection.update_one( { 'id': id }, {'$set': item })


        app.logger.warning(f'MongoFacade:update_in_collection(): - result.acknowledged: {result.acknowledged}')
        app.logger.warning(f'MongoFacade:update_in_collection(): - result.matched_count: {result.matched_count}')
        app.logger.warning(f'MongoFacade:update_in_collection(): - result.matched_count: {result.modified_count}')
        app.logger.warning(f'MongoFacade:update_in_collection(): - result.raw_result: {result.raw_result}')


        return result.acknowledged

    def _log(self, method_name, message):
        app.logger.debug('MongoFacade:{}: {}'.format(method_name, message))

class Repository:

    def __init__(self, collection_name):
        self.mongo_facade = MongoFacade()
        self.collection_name = collection_name

    def get(self):
        items = self.mongo_facade.get_collection(self.collection_name)
        return items

    def add(self, item):
        result = self.mongo_facade.insert_to_collection(self.collection_name, item)
        return result

    def delete(self, id):
        result = self.mongo_facade.delete_from_collection(self.collection_name, id)
        return result

    def update(self, id, item):
        app.logger.warning('Repository:update: id = {}'.format(id))
        app.logger.warning('Repository:update: item = {}'.format(item))
        safe_item = { x: item[x] for x in dict(item).keys() if x != '_id' }

        app.logger.warning('Repository:update: safe_item = {}'.format(json.dumps(safe_item, indent=4)))
        result = self.mongo_facade.update_in_collection(
            self.collection_name,
            id,
            safe_item
        )
        return result
    ########################################attempt
    def get_using_email(self, email): #pass in the request body here
        resp = self.mongo_facade.get_user_by_email(self.collection_name, email) ##add the request here
        return resp
    #########################################

    def _log(self, method_name, message):
        app.logger.debug('Repository[{}]:{}: {}'.format(self.collection_name, method_name, message))

# Tyler 4/6/2020
# ... removing in-memory implementation, switching to mongodb

# class GuestRepository:

#     def __init__(self):
#         self.guests = dict()

#     def __getitem__(self, guest_id):
#         return self.guests[guest_id]

#     def __setitem__(self, guest_id, guest):
#         self.guests[guest_id] = guest

#     def update(self, guest):
#         self.guests[guest.id] = guest


# class HostRepository:

#     def __init__(self):
#         self.hosts = dict()

#     def __getitem__(self, host_id):
#         return self.hosts[host_id]

#     def __setitem__(self, host_id, host):
#         self.hosts[host_id] = host

#     def update(self, host):
#         self.hosts[host.id] = host


hostRepository = Repository('hosts')
accountsRepository = Repository('accounts')
guestRepository = Repository('guests')
guestQuestionsRepository = Repository('guestQuestions')
hostQuestionsRepository = Repository('hostQuestions')
guestResponsesRepository = Repository('guestResponses')
hostResponsesRepository = Repository('hostResponses')
restrictionsRepository = Repository('restrictions')
responseValuesRepository = Repository('responseValues')


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


matcher = BasicFilter(repos)


@app.route('/favicon.ico')
def favicon():
    return send_from_directory(
        app.root_path,
        'favicon.ico',
        mimetype='image/vnd.microsoft.icon'
    )





###############
## Hosts API ##
###############

@app.route('/api/hosts/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def host_by_id(id: int):

    app.logger.warning('host_by_id: request.method = {}'.format(request.method))
    app.logger.warning(f'host_by_id: id = {id} ({type(id)})')

    if request.method == 'GET':

        try:

            host = hostRepository.mongo_facade.get_element_by_id('hosts',id)
            js = json.dumps(host)
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

            responseData = hostRepository.update(id, request.json)
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

            responseData = hostRepository.delete(id)
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


@app.route('/api/hosts', methods=['GET', 'POST'])
def get_all_hosts():

    app.logger.warning('get_all_hosts: request.method = {}'.format(request.method))

    if request.method == 'GET':

        try:

            hosts = hostRepository.get()
            js = json.dumps(hosts)
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

            host = request.json
            responseData = hostRepository.add(host)
            app.logger.debug('responseData = {}'.format(responseData))
            resp = Response({'error': None,'data': None},
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


@app.route('/api/hostQuestions', methods=['GET'])
def get_all_hostQuestions():

    app.logger.warning('get_all_hostQuestions: request.method = {}'.format(request.method))

    try:

        hostQuestions = hostQuestionsRepository.get()
        js = json.dumps(hostQuestions)
        resp = Response(js, status=200, mimetype='application/json')
        return resp

    except Exception as e:

        data = {
            'error': str(e)
        }

        js = json.dumps(data)
        resp = Response(js, status=500, mimetype='application/json')

        return resp


@app.route('/api/hostQuestions/<int:id>', methods=['GET'])
def get_hostQuestion_by_id(id: int):

    app.logger.warning('get_hostQuestion_by_id: request.method = {}'.format(request.method))

    try:

        hostQuestion = hostQuestionsRepository.mongo_facade.get_element_by_id('hostQuestions', id)
        js = json.dumps(hostQuestion)
        resp = Response(js, status=200, mimetype='application/json')
        return resp

    except Exception as e:

        data = {
            'error': str(e)
        }

        js = json.dumps(data)
        resp = Response(js, status=500, mimetype='application/json')

        return resp

@app.route('/api/checkEmail', methods=["POST"])
def check_by_email():
    try:
        req = request.get_json() #get req from front end
        accounts = accountsRepository.get_using_email(req['email']) #pass the req in here when ready
        if accounts is None:
            return Response(json.dumps({'error': None, 'status': 400}),status=400, mimetype='application/json')
        return Response(status=200, mimetype='application/json')

    except Exception as e:
        data = {
            'error': str(e)
        }

        js = json.dumps(data)
        resp = Response(js, status=500, mimetype='application/json')

        return resp

# @app.route('/api/hosts/{id}', methods=['PUT'])
# def update_host(id: int):
#     try:

#         responseData = hostRepository.update(id, request.json)
#         app.logger.debug('responseData = {}'.format(responseData))
#         js = json.dumps(responseData)
#         resp = Response(js, status=200, mimetype='application/json')
#         return resp

#     except Exception as e:

#         data = {
#             'error': str(e)
#         }

#         js = json.dumps(data)
#         resp = Response(js, status=500, mimetype='application/json')

#         return resp


# @app.route('/api/hosts', methods=['POST'])
# def add_host():
#     global host
#     hosts = request.get_json()
#     host.update(hosts)
#     return {"hosts": hosts, }





################
## Guests API ##
################
@app.route('/api/guests', methods=['GET', 'POST'])
def get_all_guests():

    app.logger.warning('get_all_guests: request.method = {}'.format(request.method))

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
            resp = Response({'error': None,'data': None},
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

    app.logger.warning('guest_by_id: request.method = {}'.format(request.method))
    app.logger.warning(f'guest_by_id: id = {id} ({type(id)})')

    if request.method == 'GET':

        try:

            guest = guestRepository.mongo_facade.get_element_by_id('guests',id)
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

    app.logger.warning('get_all_guestQuestions: request.method = {}'.format(request.method))

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

    app.logger.warning('get_guestQuestion_by_id: request.method = {}'.format(request.method))

    try:

        guestQuestion = guestQuestionsRepository.mongo_facade.get_element_by_id('guestQuestions', id)
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



@app.route('/api/guests/<int:guest_id>/responses', methods=['GET','POST'])
def get_guest_responses(guest_id: int):

    app.logger.warning('get_guest_responses: request.method = {}'.format(request.method))
    app.logger.warning(f'guest_by_id: id = {guest_id} ({type(guest_id)})')

    if request.method == 'GET':

        try:

            guestResponses = guestResponsesRepository.get()
            guestResponses = [response for response in guestResponses\
                    if response['guestId']==guest_id]
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
            resp = Response({'error': None,'data': None},
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


@app.route('/api/guests/<int:guest_id>/responses/<int:question_id>', methods=['GET','PUT','DELETE'])
def get_guest_response_by_id(guest_id: int, question_id: int):

    app.logger.warning('get_guest_response_by_id: request.method = {}'.format(request.method))

    if request.method == 'GET':

        try:

            guestResponses = guestResponsesRepository.get()
            guestResponses = [response['responseValues'] for response in guestResponses\
                                if response['guestId']==guest_id and response['questionId']==question_id]
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
            response_id = [response['responseValues'] for response in guestResponses\
                                 if response['guestId']==guest_id and\
                                    response['questionId']==question_id][0]

            #this is really shaky, need to know what's being passed back
            #needs guest_id and question_id
            responseData = guestResponsesRepository.update(response_id, request.json)
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
            response_id = [response['responseValues'] for response in guestResponses\
                                  if response['guestId']==guest_id and\
                                     response['questionId']==question_id][0]

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


@app.route('/api/hosts/<int:host_id>/responses', methods=['GET','POST'])
def get_host_responses(host_id: int):

    app.logger.warning('get_host_responses: request.method = {}'.format(request.method))
    app.logger.warning(f'host_by_id: id = {host_id} ({type(host_id)})')

    if request.method == 'GET':

        try:

            hostResponses = hostResponsesRepository.get()
            hostResponses = [response for response in hostResponses\
                    if response['hostId']==host_id]
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
            resp = Response({'error': None,'data': None},
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


@app.route('/api/hosts/<int:host_id>/responses/<int:question_id>', methods=['GET','PUT','DELETE'])
def get_host_response_by_id(host_id: int, question_id: int):

    app.logger.warning('get_host_response_by_id: request.method = {}'.format(request.method))

    if request.method == 'GET':

        try:

            hostResponses = hostResponsesRepository.get()
            hostResponses = [response['responseValues'] for response in hostResponses\
                                if response['hostId']==host_id and response['questionId']==question_id]
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
            response_id = [response['responseValues'] for response in hostResponses\
                                 if response['hostId']==host_id and\
                                    response['questionId']==question_id][0]

            #this is really shaky, need to know what's being passed back
            #needs host_id and question_id
            responseData = hostResponsesRepository.update(response_id, request.json)
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
            response_id = [response['responseValues'] for response in hostResponses\
                                  if response['hostId']==host_id and\
                                     response['questionId']==question_id][0]

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

    app.logger.warning('all_restrictions: request.method = {}'.format(request.method))

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
            'test'  : 'failed',

            'error': str(e)
        }

        js = json.dumps(data)
        resp = Response(js, status=500, mimetype='application/json')
        return resp



@app.route('/api/matchResults', methods=['GET'])
def get_all_match_results():

    try:

        match_results = matcher.get_all_match_results()

        js = json.dumps(match_results)
        resp = Response(js, status=200, mimetype='application/json')

        return resp

    except Exception as e:

        data = {
            'test'  : 'failed',
            'error': str(e)
        }

        js = json.dumps(data)
        resp = Response(js, status=500, mimetype='application/json')
        return resp


# TODO: Better error handling for items not found in db
# TODO: Test PUT/DELETE for host/guest by id and POST for hosts/guests
# TODO: Decide if there are unnecessary info that shouldn't get returned like _id
# TODO: Verify IDs are being used properly across routes

# @app.route('/api/test')
# def test_api():

#     try:
#         mongo_client = pymongo.MongoClient('mongodb://{}:{}@{}:{}'.format(
#             quote_plus(os.getenv('DB_USER')),
#             quote_plus(os.getenv('DB_PWD')),
#             os.getenv('DB_HOST'),
#             os.getenv('DB_PORT')
#         ))


#         DB_NAME = 'hosthome'

#         db = mongo_client[DB_NAME]

#         data = {
#             'test'  : 'worked'
#         }

#         js = json.dumps(data)
#         resp = Response(js, status=200, mimetype='application/json')
#         return resp

#     except Exception as e:
#         data = {
#             'test'  : 'failed',

#             'error': str(e)
#         }

#         js = json.dumps(data)
#         resp = Response(js, status=500, mimetype='application/json')
#         return resp


# @app.route('/api/profile', methods=['POST'])
# def create_profile():
#     profile = request.get_json()

#     print('/mongo -- about to connect...')

#     try:
#         mongo_client = pymongo.MongoClient('mongodb://{}:{}@{}:{}'.format(
#             quote_plus(os.getenv('DB_USER')),
#             quote_plus(os.getenv('DB_PWD')),
#             os.getenv('DB_HOST'),
#             os.getenv('DB_PORT')
#         ))


#         DB_NAME = 'hosthome'

#         db = mongo_client[DB_NAME]
#         col = db['profiles']
#         result = col.insert_one(profile)
#         js = { '_id': result.inserted_id }

#         return jsonify(js)

#     except Exception as e:
#         data = {
#             'test'  : 'failed',

#             'error': str(e)
#         }

#         js = json.dumps(data)
#         resp = Response(js, status=500, mimetype='application/json')
#         return resp



@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    app.logger.debug("quote_plus(os.getenv('DB_USER')) = {}".format(os.getenv('DB_USER')) )
    app.logger.debug("quote_plus(os.getenv('DB_PWD')) = {}".format(os.getenv('DB_PWD')) )
    app.logger.debug("os.getenv('DB_HOST') = {}".format(os.getenv('DB_HOST')) )
    app.logger.debug("os.getenv('DB_PORT') = {}".format(os.getenv('DB_PORT')) )
    app.logger.warning('path = {}'.format(path))
    return app.send_static_file("index.html")


if __name__ == "__main__":
    handler = logging.StreamHandler(sys.stdout)
    app.logger.addHandler(handler)
    app.logger.setLevel(logging.INFO)
    app.logger.warning('starting app...')

    app.run(host="0.0.0.0", port=8080, debug=True)
