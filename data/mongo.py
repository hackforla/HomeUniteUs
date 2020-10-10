import os
import json
from urllib.parse import quote_plus
from bson import ObjectId

import pymongo
import gridfs


class MongoFacade:

    def __init__(self, logger, db_name, debug_mode=True):

        self.logger = logger
        self.db_name = db_name

        self.logger.debug(
            f'initializing mongo with db_name={db_name} and debug_mode={debug_mode}')

        if debug_mode:

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
            self.logger.debug("Server not available: {}".format(e))
            raise e

    def get_collection(self, collection_name, sort_condition):

        self._log('get_collection', 'acquiring connection...')

        client = self._get_conn()

        db = client[self.db_name]
        collection = db[collection_name]

        if sort_condition:
            cursor = collection.find().sort(sort_condition)
        else:
            cursor = collection.find()
        items = list(cursor)

        for item in items:
            item['_id'] = str(item['_id'])

        self._log('get_collection', 'items = {}'.format(items))
        return items

    def get_element_by_id(self, collection_name, id):

        self._log('get_element_by_id', 'acquiring connection...')

        client = self._get_conn()

        db = client[self.db_name]
        collection = db[collection_name]
        item = collection.find_one({'id': id})
        item['_id'] = str(item['_id'])

        self._log('get_collection', 'item = {}'.format(item))
        return item

    def get_element_by_id2(self, collection_name, id):

        self._log('get_element_by_id', 'acquiring connection...')

        client = self._get_conn()

        db = client[self.db_name]
        collection = db[collection_name]
        item = collection.find_one({'_id': id})

        item['_id'] = str(item['_id'])

        self._log('get_collection', 'item = {}'.format(item))
        return item

    def item_in_collection(self, collection_name, field_name, field_value):
        client = self._get_conn()

        if not client:
            self.logger.error(
                'MongoFacade:item_in_collection(): Mongo server not available')
            raise Exception('Mongo server not available')

        db = client[self.db_name]
        collection = db[collection_name]
        result = collection.find_one({field_name: field_value})
        if not result:
            return False
        return True

    def get_user_by_email(self, collection_name, email):
        try:
            self._log('get_user_by_email', 'acquiring connection...')
            client = self._get_conn()
            db = client[self.db_name]
            collection = db[collection_name]

            user = collection.find_one({'email': email})
            if user is None:
                return None
            # we dont need this line anymore, right?
            user['_id'] = str(user['_id'])
            self._log('get_collections', 'items = {}'.format(user))
            return user
        except Exception as e:
            self._log("get_user_by_email", f"error {e}")
            raise e

    def insert_to_collection(self, collection_name, item):
        client = self._get_conn()

        db = client[self.db_name]
        collection = db[collection_name]

        result = collection.insert_one(item).inserted_id

        return result

    def delete_from_collection(self, collection_name, id):
        client = self._get_conn()

        if not client:
            raise Exception('Mongo server not available')

        db = client[self.db_name]
        collection = db[collection_name]

        result = collection.delete_one({'_id': ObjectId(id)})
        self._log('delete_from_collection',
                  'result.raw_result = {}'.format(result.raw_result))

        return result

    def update_in_collection(self, collection_name, id, item):

        client = self._get_conn()

        if not client:
            self.logger.error(
                'MongoFacade:update_in_collection(): Mongo server not available')
            raise Exception('Mongo server not available')

        db = client[self.db_name]
        collection = db[collection_name]
        result = collection.update_one({'_id': ObjectId(id)}, {'$set': item})
        return result.acknowledged

    def save_file(self, img_file, img_name, img_subject, email, file_type):
        client = self._get_conn()
        if not client:
            raise Exception('Mongo server not available')

        db = client[self.db_name]
        fs = gridfs.GridFS(db)
        img_id = fs.put(
            img_file,
            filename=img_name,
            contentType=file_type,
            subject=img_subject,
            email=email)  # got img id
        if img_id is None:
            return None
        # if fs.find_one(img_id) is None:
        #     return "success??"
        # next, store the img id in the user database somehow
        return img_id

    def load_file(self, fileId):  # need to pass userId
        client = self._get_conn()
        db = client[self.db_name]
        fs = gridfs.GridFS(db)
        record = fs.get(ObjectId(fileId))
        self.logger.debug(f'MongoFacade:load_file: record = {record}')
        for key in dir(record):
            if callable(getattr(record, key)):
                continue
            self.logger.debug(f'- {key}: {getattr(record, key)}')
        return record

    # need to pass userId
    def get_files_for_user_with_subject(self, email, subject):
        client = self._get_conn()
        db = client[self.db_name]
        fs = gridfs.GridFS(db)
        records = fs.find({"email": email, "subject": subject})
        items = list(records)
        # for item in items:
        #     item['_id'] = str(item['_id'])
        return items
        # user = collection.find_one() #get user by id and image id
        # image = fs.get(user[]) #using the user id to find image id
        # base64_data = codecs.encode(image.read(), "base64") #using codecs to retrieve image
        # image = base64_data.decode("utf-8")

    def add_field_to_record(self, collection_name, id_field_name, id_field_value, field_name, field_data):
        client = self._get_conn()

        if not client:
            self.logger.error(
                'MongoFacade:update_in_collection(): Mongo server not available')
            raise Exception('Mongo server not available')

        field_data_clean = {
            x: field_data[x] for x in field_data.keys() if x != id_field_name}
        # field_data_clean = {}
        # for field_key in field_data.keys():
        #     self.logger.debug()
        #     if field_key != id_field_name:
        #         field_data_clean[field_key] = field_data[]

        db = client[self.db_name]
        collection = db[collection_name]

        result = collection.update_one(
            {id_field_name: id_field_value}, {'$set': {field_name: field_data_clean}})

        return result.acknowledged

    def add_field_to_record_child(self, collection_name, id_field_name, id_field_value, child_name, field_name, field_data):
        client = self._get_conn()

        if not client:
            self.logger.error(
                'MongoFacade:update_in_collection(): Mongo server not available')
            raise Exception('Mongo server not available')

        db = client[self.db_name]
        collection = db[collection_name]

        result = collection.find_one({id_field_name: id_field_value})
        if not result:
            raise Exception(
                f'No account with {id_field_name}: {id_field_value}')

        print(
            f'add_field_to_record_child: record for {id_field_name}: {id_field_value}')
        pprint.pprint(result)

        # if child_name in result:
        #     new_child = list(result[child_name])
        # else:
        #     new_child = []
        # new_child.append({
        #     field_name: field_data
        # })

        if child_name in result:
            new_child = dict(result[child_name])
        else:
            new_child = dict()
        new_child[field_name] = field_data

        result = collection.update_one(
            {id_field_name: id_field_value}, {'$set': {child_name: new_child}})

        return result.acknowledged

    def add_to_child_collection(self, collection_name, record_id, child_collection_name, data):
        try:

            client = self._get_conn()

            if not client:
                self.logger.error(
                    'MongoFacade:add_to_child_collection(): Mongo server not available')
                raise Exception('Mongo server not available')

            self.logger.debug('MongoFacade:add_to_child_collection():')
            self.logger.debug(f'- collection_name: {collection_name}')
            self.logger.debug(f'- record_id: {record_id}')
            self.logger.debug(
                f'- child_collection_name: {child_collection_name}')
            self.logger.debug(f'- data: {data}')

            db = client[self.db_name]
            collection = db[collection_name]

            result = collection.find_one({'_id': ObjectId(record_id)})

            if child_collection_name in result:
                new_child = list(result[child_collection_name])
            else:
                new_child = list()

            new_child.append(data)

            self.logger.debug(
                f'MongoFacade:add_to_child_collection(): about to set field {child_collection_name} to "{new_child}"')

            result = collection.update_one(
                {'_id': ObjectId(record_id)}, {'$set': {child_collection_name: new_child}})

            return result.acknowledged

        except Exception as e:
            self.logger.error(
                f'MongoFacade:add_to_child_collection(): error: {e}')

    def update_in_child_collection(self, collection_name, record_id, child_collection_name, child_record_id, data):
        try:

            client = self._get_conn()

            if not client:
                self.logger.error(
                    'MongoFacade:update_in_child_collection(): Mongo server not available')
                raise Exception('Mongo server not available')

            self.logger.debug('MongoFacade:update_in_child_collection():')
            self.logger.debug(f'- collection_name: {collection_name}')
            self.logger.debug(f'- record_id: {record_id}')
            self.logger.debug(
                f'- child_collection_name: {child_collection_name}')
            self.logger.debug(f'- data: {data}')

            db = client[self.db_name]
            collection = db[collection_name]

            result = collection.find_one({'_id': ObjectId(record_id)})

            new_child = list()
            for child_record in list(result[child_collection_name]):
                if child_record['id'] == child_record_id:
                    new_child.append(data)
                else:
                    new_child.append(child_record)

            self.logger.debug(
                f'MongoFacade:update_in_child_collection(): about to set field {child_collection_name} to "{new_child}"')

            result = collection.update_one(
                {'_id': ObjectId(record_id)}, {'$set': {child_collection_name: new_child}})

            return result.acknowledged

        except Exception as e:
            self.logger.error(
                f'MongoFacade:update_in_child_collection(): error: {e}')

    def _log(self, method_name, message):
        self.logger.debug('MongoFacade:{}: {}'.format(method_name, message))
