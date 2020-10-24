import json
from flask import jsonify, make_response
from data.mongo import MongoFacade

import gridfs


class Repository:

    def __init__(self, collection_name, logger, db_name):
        self.logger = logger
        self.mongo_facade = MongoFacade(
            logger, db_name, debug_mode=True)
        self.collection_name = collection_name

    def get(self, sort_condition=None):
        items = self.mongo_facade.get_collection(
            self.collection_name, sort_condition)
        return items

    def get_by_id(self, id):
        item = self.mongo_facade.get_element_by_id2(self.collection_name, id)
        return item

    def add(self, item):
        result = self.mongo_facade.insert_to_collection(
            self.collection_name, item)
        return result

    def delete(self, id):
        result = self.mongo_facade.delete_from_collection(
            self.collection_name, id)
        return result

    def update(self, id, item):
        self.logger.warning('Repository:update: id = {}'.format(id))
        self.logger.warning('Repository:update: item = {}'.format(item))
        safe_item = {x: item[x] for x in dict(item).keys() if x != '_id'}

        self.logger.warning('Repository:update: safe_item = {}'.format(
            json.dumps(safe_item, indent=4)))
        result = self.mongo_facade.update_in_collection(
            self.collection_name,
            id,
            safe_item
        )
        return result

    def get_using_email(self, email):  # pass in the request body here
        resp = self.mongo_facade.get_user_by_email(
            self.collection_name, email)  # add the request here
        return resp

    def _log(self, method_name, message):
        self.logger.debug('Repository[{}]:{}: {}'.format(
            self.collection_name, method_name, message))


class Case_Repository:
    def __init__(self, collection_name, db_name):  
        self.db_name = db_name      
        self.collection_name = collection_name

    def new_case(self, resp):
        try:
            case = self.collection_name.insert_one(resp) #insert to db
            return jsonify(status={"code": 200, "message": "success"})
        except Exception as e:
            return jsonify(error=str(e)), 404 

    def update_case(self, resp):
        try:
            status_id = response['status_id']
            case_id = response['case_id']

            found_case = self.collection_name.find({ "_id": ObjectId(case_id)})

            if not found_case: 
                return jsonify("Case does not exist"), 404

            case = self.collection_name.update_one({ "_id": ObjectId(case_id)}, { "$set": { "status_id": status_id }})
            
            return jsonify("Update case status successfully", case), 200
 
        except Exception as e:
            return jsonify(error=str(e)), 404
    
    def reassign_case(self, resp):
        try:
            case_id = response['case_id']
            caseworker_id = response['caseworker_id']

            found_case = self.collection_name.find({ "_id": ObjectId(case_id)}) 

            if not found_case: #if case does not exists
                return jsonify("Case does not exist"), 404

            case = self.collection_name.update_one({ "_id": ObjectId(case_id) }, { "$set": { "caseworker_id": caseworker_id }}) #find the case and update caseworker

            return jsonify("Reassigned case successfully", case), 200
        except Exception as e:
            return jsonify(error=str(e)), 404
        

