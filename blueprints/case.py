import json
from flask import Blueprint, render_template, abort, jsonify, current_app, request, Response
import pymongo
from bson import ObjectId #this is not needed 
from config.constants import DB_NAME

case_api = Blueprint('case_api', __name__,
                          template_folder='templates')

client = pymongo.MongoClient()    
db = client[DB_NAME]
collection = db[cases] #cases collection?

@case_api.route('/create_case', methods=['POST'])
def create_case():
  
  current_app.logger.debug(f'create_case: caseworker_id={caseworker_id}, guest_id={guest_id}')

  try:
    response = request.json
    
    if not response:
      return jsonify(error=str(e)), 204 #no content

    caseworker_id = response['caseworker_id']
    guest_id = response['guest_id']

    case = collection.insert({ "caseworker_id": caseworker_id, "guest_id": guest_id }) #save to db
    return jsonify("Case created successfully", case), 201 #status code = "created"

  except Exception as e:
    return jsonify(error=str(e)), 404 
