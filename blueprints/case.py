import json
from flask import Blueprint, render_template, abort, jsonify, current_app, request, Response
import pymongo
from bson import ObjectId 
from config.constants import DB_NAME

case_api = Blueprint('case_api', __name__,
                          template_folder='templates')

client = pymongo.MongoClient()    
db = client[DB_NAME]
collection = db['case'] #case collection name?

#gonna move the implementation to repo class after I finish

@case_api.route('/create_case', methods=['POST'])
def create_case():

   # i think there should be a default status_id when new creating a case
  
  try:
    response = request.json
    
    if not response:
      return jsonify(error=str(e)), 204 #no content
    
    if not response['caseworker_id'] or not response['guest_id']: #if one of them is not  
      return jsonify("Require both caseworker and guest id"), 400 

    caseworker_id = response['caseworker_id']
    guest_id = response['guest_id']
    status_id = response['status_id']

    case = collection.insert({ "caseworker_id": caseworker_id, "guest_id": guest_id, "status_id": status_id }) #save to db
    return jsonify("Case created successfully", case), 201 #status code = "created"

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

    case_id = response['case_id']
    caseworker_id = response['caseworker_id']

    found_case = collection.find({ "_id": ObjectId(case_id)}) 

    if not found_case: #if case does not exists
      return jsonify("Case does not exist"), 204

    case = collection.update_one({ "_id": ObjectId(case_id) }, { "$set": { "caseworker_id": caseworker_id }}) #find the case and update caseworker

    return jsonify("Reassigned case successfully", case), 200 #not found

  except Exception as e:
    return jsonify(error=str(e)), 404