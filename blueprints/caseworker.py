import json
from flask import Blueprint, render_template, abort, jsonify, current_app, request, Response
from jinja2 import TemplateNotFound #this is not needed
import pymongo
from bson import ObjectId #this is not needed 
from config.constants import DB_NAME

caseworker_api = Blueprint('caseworker_api', __name__,
                          template_folder='templates')

client = pymongo.MongoClient()
db = client[DB_NAME]
collection = db['caseWorkers']

# UNFINISHED
# need to fix -> collection_name = f'{<what goes here>}'
@caseworker_api.route('/', methods=['GET'])
def get_all_caseworkers(orgname): # not sure if this is correct?

  current_app.logger.debug(f'get_all_caseworkers: orgname={orgname}')

  try:
    org = collection.find(orgname) 
    # caseworker = [model_to_dict(worker) for worker in org.find()] # Im guessing here
    # print(caseworker)
    data = org.find() #
    return jsonify(data=data, status={"code": 200, "message": "Success"})

  except Exception as e:
    return jsonify(error=str(e)), 404
  # return all caseworkers for organization

# UNFINISHED
# need to fix -> collection_name = f'{<what goes here>}'
@caseworker_api.route('<caseworker_id>', methods=['GET'])
def get_caseworkers(orgname, caseworker_id): # not sure if this is correct?

  current_app.logger.debug(f'get_caseworkers: orgname={orgname}, caseworker_id={caseworker_id}')

  try:
    
  except Exception as e:
    return jsonify(error=str(e)), 404
  # return all caseworkers for organization

# UNFINISHED
# NE
# need to fix -> collection_name = f'{<what goes here>}'
@caseworker_api.route('/', methods=['POST'])
def add_caseworker(): 
  
  current_app.logger.debug(f'add_caseworkers: orgname={orgname}')

  try:
    data = request.json #get the response?
    data['orgname'] 
    
  except Exception as e:
    return jsonify(error=str(e)), 404
  # add a new caseworker to an organization

# UNFINISHED
# not sure how to update the caseworker 
@caseworker_api.route('/<caseworker_id>', methods=['PUT'])
def update_caseworker(orgname, caseworker_id): 
  
  current_app.logger.debug(f'update_caseworkers: orgname={orgname}, caseworker_id={caseworker_id}')

  try:
    client = pymongo.MongoClient()
    db = client[DB_NAME]

    collection_name = f'{}' # I guess find the orgname collection? 
    collection = db[collection_name]
    
  except Exception as e:
    return jsonify(error=str(e)), 404
  # update a caseworker by id

# UNFINISHED
# need to fix -> collection_name = f'{<what goes here>}'
@caseworker_api.route('/<caseworker_id>', methods=['PUT'])
def delete_caseworker(orgname, caseworker_id): 

  current_app.logger.debug(f'delete_caseworkers: orgname={orgname}, caseworker_id={caseworker_id}')

  try:
    client = pymongo.MongoClient()
    db = client[DB_NAME]
    # collection_name = f'{caseworker_id}' #caseworker_id?
    
  except Exception as e:
    return jsonify(error=str(e)), 404
  # delete a caseworker by id