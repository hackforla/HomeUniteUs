import json
from flask import Blueprint, render_template, abort, jsonify, current_app, request, Response
from jinja2 import TemplateNotFound #this is not needed
import pymongo
from bson.objectid import ObjectId
from config.constants import DB_NAME

caseworker_api = Blueprint('caseworker_api', __name__,
                          template_folder='templates')

client = pymongo.MongoClient()    
db = client[DB_NAME]
collection = db['caseWorkers'] 

@caseworker_api.route('/', methods=['GET'])
def get_all_caseworkers(orgname): # not sure if this is correct? also should it be orgname or orgId??

  current_app.logger.debug(f'get_all_caseworkers: orgname={orgname}')

  try:
    case_workers = collection.find({ "org": orgname })

    if len(case_workers) <= 0:
      return jsonify(status=400, msg="No casworkers")

    return jsonify()

  except Exception as e:
    return jsonify(error=str(e)), 404
  # return all caseworkers for organization

# UNFINISHED
# need to fix -> collection_name = f'{<what goes here>}'
@caseworker_api.route('<caseworker_id>', methods=['GET'])
def get_caseworker(orgname, caseworker_id): # not sure if this is correct?

  current_app.logger.debug(f'get_caseworker: orgname={orgname}, caseworker_id={caseworker_id}')

  try:
    client = pymongo.MongoClient()
    db = client[DB_NAME]

    case_worker = collection.find_one({ "_id": caseworker_id, "org": orgname })

    
  except Exception as e:
    return jsonify(error=str(e)), 404
  # return all caseworkers for organization

# UNFINISHED
# need to fix -> collection_name = f'{<what goes here>}'
@caseworker_api.route('/', methods=['POST'])
def add_caseworker(orgname): 
  
  current_app.logger.debug(f'add_caseworkers: orgname={orgname}')

  try:
    data = request.json
    print(data,",------------------the data?")
    if not data:
      return jsonify(status=404, msg="data is empty")

    data["org"] = orgname
    print(collection, "<----------what is the collection")
    collection.insert_one(data)

    return jsonify(status=200, msg="Added caseworker succesfully")    
  except Exception as e:
    return jsonify(error=str(e)), 404

@caseworker_api.route('/<caseworker_id>', methods=['PUT'])
def update_caseworker(orgname, caseworker_id): 
  
  current_app.logger.debug(f'update_caseworkers: orgname={orgname}, caseworker_id={caseworker_id}')

  #TODO !
  try:
    update_response = request.json

    found_data = collection.find_one({ "_id": ObjectId(caseworker_id) })

    if found_data is None:
      return jsonify(status=404, msg="caseworker does not exist")

    collection.find_one_and_update({ "_id": ObjectId(caseworker_id) }, { "$set": { **update_response }})
    
    return jsonify(status=200, msg="Caseworker updated successfully")
  except Exception as e:
    return jsonify(error=str(e)), 404

@caseworker_api.route('/<caseworker_id>', methods=['DELETE'])
def delete_caseworker(orgname, caseworker_id): 

  current_app.logger.debug(f'delete_caseworkers: orgname={orgname}, caseworker_id={caseworker_id}')

  try:
    print("hello world")
    
  except Exception as e:
    return jsonify(error=str(e)), 404
