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

        self._log('get_collection', 'items = {}'.format(items))
        return item
    ###########################################################attempt
    def get_user_by_email(self): #need to add param called email here
        self._log('get_user_by_email', 'acquiring connection...')
        client = self._get_conn()
        db = client[MONGO_DATABASE]
        collection = db['hosts']
        user = collection.find_one({ 'email': 'diana.patterson@gmail.com' }) #email needs to be replace with request body
        
        self._log('get_collections', 'items = {}'.format(user))
        return user
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

        app.logger.warn('MongoFacade:update_in_collection(): id = {} ({})'.format(id, type(id)))
        app.logger.warn('MongoFacade:update_in_collection(): item = {}'.format(item))
        app.logger.warn('MongoFacade:update_in_collection(): collection_name = {}'.format(collection_name))

        client = self._get_conn()

        if not client:
            app.logger.error('MongoFacade:update_in_collection(): Mongo server not available')
            raise Exception('Mongo server not available')

        app.logger.warn(f'MongoFacade:update_in_collection(): getting DB {MONGO_DATABASE}...')
        db = client[MONGO_DATABASE]

        app.logger.warn(f'MongoFacade:update_in_collection(): getting collection {collection_name}...')
        collection = db[collection_name]

        app.logger.warn(f'MongoFacade:update_in_collection(): updating item in collection...')
        result = collection.update_one( { 'id': id }, {'$set': item })


        app.logger.warn(f'MongoFacade:update_in_collection(): - result.acknowledged: {result.acknowledged}')
        app.logger.warn(f'MongoFacade:update_in_collection(): - result.matched_count: {result.matched_count}')
        app.logger.warn(f'MongoFacade:update_in_collection(): - result.matched_count: {result.modified_count}')
        app.logger.warn(f'MongoFacade:update_in_collection(): - result.raw_result: {result.raw_result}')


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
        self.mongo_facade.delete_from_collection(self.collection_name, id)
        return result

    def update(self, id, item):
        app.logger.warn('Repository:update: id = {}'.format(id))
        app.logger.warn('Repository:update: item = {}'.format(item))
        safe_item = { x: item[x] for x in dict(item).keys() if x != '_id' }

        app.logger.warn('Repository:update: safe_item = {}'.format(json.dumps(safe_item, indent=4)))
        result = self.mongo_facade.update_in_collection(
            self.collection_name, 
            id,
            safe_item
        )
        return result
    ########################################attempt
    def get_using_email(self): #pass in the request body here
        resp = self.mongo_facade.get_user_by_email() ##add the request here
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
guestRepository = Repository('guests')
guestQuestionsRepository = Repository('guestQuestions')
hostQuestionsRepository = Repository('hostQuestions')
guestResponsesRepository = Repository('guestResponses')
hostResponsesRepository = Repository('hostResponses')
restrictionsRepository = Repository('restrictions')
responseValuesRepository = Repository('responseValues')


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

    app.logger.warn('host_by_id: request.method = {}'.format(request.method))
    app.logger.warn(f'host_by_id: id = {id} ({type(id)})')

    if request.method == 'GET':

        try:           

            host = hostRepository.get_element_by_id(id)        
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

    else:

        try:           

            responseData = hostRepository.update(id, request.json)      
            app.logger.debug('responseData = {}'.format(responseData))  
            # js = json.dumps(responseData)    
            resp = Response(json.dumps({'error': None, 'data': None}), status=200, mimetype='application/json')
            return resp

        except Exception as e:

            data = {
                'error': str(e)
            }
            
            js = json.dumps(data)    
            resp = Response(js, status=500, mimetype='application/json')
            
            return resp

            
@app.route('/api/hosts', methods=['GET', 'POST'])
def get_all_hosts():

    app.logger.warn('get_all_hosts: request.method = {}'.format(request.method))

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

@app.route('/api/checkEmail', methods=["POST"])
def check_by_email():
    try:
        # req = request.json() #get req from front end
        host = hostRepository.get_using_email()
        # print(host, "<------------------------------------------------the host") this is a dictionary
        # js = json.dumps(host) #<----------------this doesnt work for some reason
        # resp = Response(js, status=200, mimetype='application/json')
        resp = Response(host, status=200, mimetype='application/json')
        print(resp, "<----------------------------------resp")
        return resp
                
    except Exception as e:
        return e

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
# @app.route('/api/guests', methods=['GET'])
# def get_all_guests():
#     try:           

#         guests = guestRepository.get()        
#         js = json.dumps(guests)    
#         resp = Response(js, status=200, mimetype='application/json')
#         return resp

#     except Exception as e:

#         data = {
#             'error': str(e)
#         }
        
#         js = json.dumps(data)    
#         resp = Response(js, status=500, mimetype='application/json')

#         return resp


# @app.route('/api/guests/{id}', methods=['GET'])
# def get_guest_by_id(id: int):
#     try:           

#         guest = guestRepository.get_element_by_id(id)        
#         js = json.dumps(guest)    
#         resp = Response(js, status=200, mimetype='application/json')
#         return resp

#     except Exception as e:

#         data = {
#             'error': str(e)
#         }
        
#         js = json.dumps(data)    
#         resp = Response(js, status=500, mimetype='application/json')
        
#         return resp


# @app.route('/api/guests', methods=['POST'])
# def add_guest():
#     global guest
#     guests = request.get_json()
#     guest.update(guests)
#     return {"guests": guests, }


# @app.route('/api/guests/{id}', methods=['PUT'])
# def update_guest(id: int):
#     global guest
#     guests = request.get_json()
#     try:
#         guest[str(id)] = guests
#     except Exception as e:
#         raise e
#     return {"guest": guest[str(id)], "status": guests.status_code}


# @app.route('/api/guests/{id}', methods=['DELETE'])
# def delete_guest(id: int):
#     global guest
#     guests = request.get_json()
#     guest_id = guests[str(id)]
#     del guest[guest_id]
#     if guest[guest_id] is None:
#         success = "deleted!"
#     else:
#         success = "no"
#     return {"success": success, "status": guests.status_code}


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
    app.logger.warn('path = {}'.format(path))
    return app.send_static_file("index.html")


if __name__ == "__main__":
    handler = logging.StreamHandler(sys.stdout)
    app.logger.addHandler(handler)
    app.logger.setLevel(logging.INFO)
    app.logger.warn('starting app...')
    
    app.run(host="0.0.0.0", port=8080, debug=True)
