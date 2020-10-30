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

@caseworker_api.route('<caseworker_id>', methods=['GET'])
def get_caseworker(orgname, caseworker_id): # not sure if this is correct?

  current_app.logger.debug(f'get_caseworker: orgname={orgname}, caseworker_id={caseworker_id}')

  try:
    cursor = collection.find({ "_id": ObjectId(caseworker_id) })
    
    if cursor is None:
      return jsonify(status=400, msg="Caseworker not found/doesn't exist")
    
    case_worker = list(cursor)

    for cw in case_worker:
      cw["_id"] = str(cw['_id'])
    
    return jsonify(case_worker)
  except Exception as e:
    return jsonify(error=str(e)), 404

@caseworker_api.route('/', methods=['POST'])
def add_caseworker(orgname): 
  
  current_app.logger.debug(f'add_caseworkers: orgname={orgname}')

  try:
    data = request.json

    if not data:
      return jsonify(status=404, msg="data is empty")

    data["org"] = orgname

    collection.insert_one(data)

    return jsonify(status=200, msg="Added caseworker succesfully")    
  except Exception as e:
    return jsonify(error=str(e)), 404

@caseworker_api.route('/<caseworker_id>', methods=['PUT'])
def update_caseworker(orgname, caseworker_id): 
  
  current_app.logger.debug(f'update_caseworkers: orgname={orgname}, caseworker_id={caseworker_id}')

  try:
    update_response = request.json

    found_data = collection.find_one({ "_id": ObjectId(caseworker_id) })

    if found_data is None:
      return jsonify(status=404, msg="Casworker not found/doesn't exist")

    collection.find_one_and_update({ "_id": ObjectId(caseworker_id) }, { "$set": { **update_response }})
    
    return jsonify(status=200, msg="Caseworker updated successfully")
  except Exception as e:
    return jsonify(error=str(e)), 404

@caseworker_api.route('/<caseworker_id>', methods=['DELETE'])
def delete_caseworker(orgname, caseworker_id): 

  current_app.logger.debug(f'delete_caseworkers: orgname={orgname}, caseworker_id={caseworker_id}')

  try:
    case_worker = collection.find_one({ "_id": ObjectId(caseworker_id) })
    
    if case_worker is None:
      return jsonify(status=400, msg="Casworker not found/doesn't exist")
    
    if case_worker['org'] != orgname:
      return jsonify(status=400, msg="Casworker doesnt work for this organization")

    deleting_caseworker = collection.delete_one({ "_id": ObjectId(caseworker_id) })

    return jsonify(data=deleting_caseworker, status=400, msg="deleting caseworker was successful")
  except Exception as e:
    return jsonify(error=str(e)), 404
