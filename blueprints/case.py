import json
from flask import Blueprint, render_template, abort, jsonify, current_app, request, Response
import pymongo
from bson import ObjectId 
from config.constants import DB_NAME
# from ..data.repositories import Case_Repository #importing data?
import sys
sys.path.append('.')
from data.repositories import Case_Repository

case_api = Blueprint('case_api', __name__,
                          template_folder='templates')

client = pymongo.MongoClient()    
db = client[DB_NAME]
collection = db['case'] ####case collection name?
case_repository = Case_Repository(collection, db)

@case_api.route('/create_case', methods=['POST'])
def create_case():
  try:
    response = request.json
    if response is None:
      return jsonify(error=str(e)), 204 #no content
    if not response['caseworker_id'] or not response['guest_id'] or not response['status_id']: #if one of them is not  
      return jsonify("Require both caseworker and guest id"), 400 
    data = case_repository.new_case(response)
    
    return jsonify(status=200, msg="Successfully created case")
  except Exception as e:
    return jsonify(error=str(e)), 404 

@case_api.route('/update_case_status', methods=['POST'])
def update_case_status():

  try:
    response = request.json

    if response is None:
      return jsonify("bad request, nothing in response in update_case_status"), 400

    if not response['case_id'] or not response['status_id']:
      return jsonify("Both fields must be filled"), 400

    data = case_repository.update_case_status(response)
    
    return jsonify(status=200, msg="Updated the status of the Case")

  except Exception as e:
    return jsonify(error=str(e)), 404


@case_api.route('/reassign_case', methods=['POST'])
def reassign_case():
  
  try:
    response = request.json

    if not response:
      return jsonify("bad request, nothing in response in reassign case method"), 400 #bad request
    
    if not response['caseworker_id'] or not response['case_id']: #if one of them is not  
      return jsonify("Require both caseworker and case id"), 400 #bad request

    data = case_repository.reassign_case(response)

    return jsonify(status=200, msg="Reassigned the case successfully")
  except Exception as e:
    return jsonify(error=str(e)), 404