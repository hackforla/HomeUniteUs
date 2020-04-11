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
    static_url_path='',
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

        result = collection.delete_one({'_id':ObjectId(id)})
        self._log('delete_from_collection', 'result.raw_result = {}'.format(result.raw_result))

        return result

    def update_in_collection(self, collection_name, id, item):

        client = self._get_conn()

        if not client:
            raise Exception('Mongo server not available')

        db = client[MONGO_DATABASE]
        collection = db[collection_name]

        result = collection.update_one({'_id':ObjectId(id)}, {'$set': item })

        self._log('update_in_collection', 'result.raw_result = {}'.format(result.raw_result))

        return result

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
        result = self.mongo_facade.update_in_collection(self.collection_name, id, item)
        return result

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


@app.route('/favicon.ico')
def favicon():
    return send_from_directory(
        app.root_path,
        'favicon.ico',
        mimetype='image/vnd.microsoft.icon'
    )


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    app.logger.debug("quote_plus(os.getenv('DB_USER')) = {}".format(os.getenv('DB_USER')) )
    app.logger.debug("quote_plus(os.getenv('DB_PWD')) = {}".format(os.getenv('DB_PWD')) )
    app.logger.debug("os.getenv('DB_HOST') = {}".format(os.getenv('DB_HOST')) )
    app.logger.debug("os.getenv('DB_PORT') = {}".format(os.getenv('DB_PORT')) )
    app.logger.warn('path = {}'.format(path))
    return app.send_static_file("index.html")


@app.route('/api/host', methods=['GET'])
def get_all_hosts():
    hosts = request.get_json()
    return {"hosts": hosts, "status": hosts.status_code}


@app.route('/api/host/{id}', methods=['GET'])
def get_host_by_id(id: int):
    global host
    hosts = request.get_json()
    host_id = hosts[str(id)]
    host_output = host[host_id]
    return {"host": host_output, "status": hosts.status_code}


@app.route('/api/host', methods=['POST'])
def add_host():
    global host
    hosts = request.get_json()
    host.update(hosts)
    return {"hosts": hosts, }


@app.route('/api/host/{id}', methods=['PUT'])
def update_host(id: int):
    global host
    hosts = request.get_json()
    try:
        host[str(id)] = hosts
    except Exception as e:
        raise e
    return {"host": host[str(id)], "status": hosts.status_code}


@app.route('/api/host/{id}', methods=['DELETE'])
def delete_host(id: int):
    global host
    hosts = request.get_json()
    host_id = hosts[str(id)]
    del host[host_id]
    if host[host_id] is None:
        success = "deleted!"
    else:
        success = "no"
    return {"success": success, "status": hosts.status_code}


@app.route('/api/guest', methods=['GET'])
def get_all_guests():
    global guest
    guests = request.get_json()
    return {"guests": guests, "status": guests.status_code}


@app.route('/api/guest/{id}', methods=['GET'])
def get_guest_by_id(id: int):
    guests = request.get_json()
    guest_id = guests[str(id)]
    guest_output = guest[guest_id]
    return {"guest": guest_output, "status": guests.status_code}


@app.route('/api/guest', methods=['POST'])
def add_guest():
    global guest
    guests = request.get_json()
    guest.update(guests)
    return {"guests": guests, }


@app.route('/api/guest/{id}', methods=['PUT'])
def update_guest(id: int):
    global guest
    guests = request.get_json()
    try:
        guest[str(id)] = guests
    except Exception as e:
        raise e
    return {"guest": guest[str(id)], "status": guests.status_code}


@app.route('/api/guest/{id}', methods=['DELETE'])
def delete_guest(id: int):
    global guest
    guests = request.get_json()
    guest_id = guests[str(id)]
    del guest[guest_id]
    if guest[guest_id] is None:
        success = "deleted!"
    else:
        success = "no"
    return {"success": success, "status": guests.status_code}


@app.route('/api/dataset', methods=['GET'])
def get_all_data():

    try:           

        hosts = hostRepository.get()
        guests = guestRepository.get()
        guestQuestions = guestQuestionsRepository.get()
        hostQuestions = hostQuestionsRepository.get()
        guestResponses = guestResponsesRepository.get()
        hostResponses = hostResponsesRepository.get()
        restrictions = restrictionsRepository.get()

        data = {
            'hosts': hosts,
            'guests': guests,
            'guestQuestions': guestQuestions,
            'hostQuestions': hostQuestions,
            'guestResponses': guestResponses,
            'hostResponses': hostResponses,
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


@app.route('/api/test')
def test_api():    

    try:           
        mongo_client = pymongo.MongoClient('mongodb://{}:{}@{}:{}'.format(
            quote_plus(os.getenv('DB_USER')),
            quote_plus(os.getenv('DB_PWD')),
            os.getenv('DB_HOST'),
            os.getenv('DB_PORT')
        ))


        DB_NAME = 'hosthome'

        db = mongo_client[DB_NAME]

        data = {
            'test'  : 'worked'
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


@app.route('/api/profile', methods=['POST'])
def create_profile():
    profile = request.get_json()

    print('/mongo -- about to connect...')

    try:           
        mongo_client = pymongo.MongoClient('mongodb://{}:{}@{}:{}'.format(
            quote_plus(os.getenv('DB_USER')),
            quote_plus(os.getenv('DB_PWD')),
            os.getenv('DB_HOST'),
            os.getenv('DB_PORT')
        ))


        DB_NAME = 'hosthome'

        db = mongo_client[DB_NAME]
        col = db['profiles']
        result = col.insert_one(profile)
        js = { '_id': result.inserted_id }

        return jsonify(js)

    except Exception as e:
        data = {
            'test'  : 'failed',

            'error': str(e)
        }
        
        js = json.dumps(data)    
        resp = Response(js, status=500, mimetype='application/json')
        return resp



if __name__ == "__main__":
    handler = logging.StreamHandler(sys.stdout)
    app.logger.addHandler(handler)
    app.logger.setLevel(logging.INFO)
    app.logger.warn('starting app...')
    
    app.run(host="0.0.0.0", port=8080, debug=True)
