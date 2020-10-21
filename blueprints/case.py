import json
from flask import Blueprint, render_template, abort, jsonify, current_app, request, Response
import pymongo
from bson import ObjectId 
from config.constants import DB_NAME
from ...data.repositories import Case_Repository #importing data?

case_api = Blueprint('case_api', __name__,
                          template_folder='templates')

client = pymongo.MongoClient()    
db = client[DB_NAME]
collection = db['case'] #case collection name?

case_repository = Case_Repository(collection, db)

#gonna move the implementation to repo class after I finish

@case_api.route('/create_case', methods=['POST'])
def create_case():

  try:
    response = request.json
    if not response:
      return jsonify(error=str(e)), 204 #no content
    if not response['caseworker_id'] or not response['guest_id'] or not response['status_id']: #if one of them is not  
      return jsonify("Require both caseworker and guest id"), 400 
    case_repository.new_case(response)

  except Exception as e:
    return jsonify(error=str(e)), 404 

#unfinished
@case_api.route('/update_case_status', methods=['POST'])
def update_case_status():

  try:

  except Exception as e:
    return jsonify(error=str(e)), 404


@case_api.route('/reassign_case', methods=['POST'])
def reassign_case():
  
  try:
    response = request.json

    if not response:
      return jsonify(error=str(e)), 400 #bad request
    
    if not response['caseworker_id'] or not response['case_id']: #if one of them is not  
      return jsonify("Require both caseworker and case id"), 400 #bad request

    case_repository.reassign_case(response)

  except Exception as e:
    return jsonify(error=str(e)), 404