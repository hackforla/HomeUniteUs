import json
from flask import Blueprint, render_template, abort, jsonify, current_app, request, Response
from jinja2 import TemplateNotFound
import pymongo
from bson import ObjectId
from config.constants import DB_NAME

questions_api = Blueprint('questions_api', __name__,
                          template_folder='templates')


@questions_api.route('/', methods=['GET'])
def get_questions(org, user_type, question_type):

    current_app.logger.debug(
        f'get_questions: org={org}, user_type={user_type}, question_type={question_type}')

    try:

        client = pymongo.MongoClient()
        db = client[DB_NAME]

        collection_name = f'{question_type.lower()}Questions'
        collection = db[collection_name]

        cursor = collection.find({
            'org': org
        })

        questions = list(cursor)

        for question in questions:
            question['_id'] = str(question['_id'])

        return jsonify(questions)

    except Exception as e:

        return jsonify(error=str(e)), 404


@questions_api.route('/<question_id>', methods=['GET'])
def get_question_by_id(org, user_type, question_type, question_id):

    current_app.logger.debug(
        f'get_questions: org={org}, user_type={user_type}, question_type={question_type}')

    try:

        client = pymongo.MongoClient()
        db = client[DB_NAME]

        collection_name = f'{question_type.lower()}Questions'
        collection = db[collection_name]

        cursor = collection.find({
            'org': org,
            '_id': ObjectId(question_id)
        })

        questions = list(cursor)

        for question in questions:
            question['_id'] = str(question['_id'])

        return jsonify(questions)

    except Exception as e:

        return jsonify(error=str(e)), 404


@questions_api.route('/', methods=['POST'])
def add_question(org, user_type, question_type):

    current_app.logger.debug(
        f'get_questions: org={org}, user_type={user_type}, question_type={question_type}')

    try:

        data = request.json
        data.update({'org': org})

        client = pymongo.MongoClient()
        db = client[DB_NAME]

        collection_name = f'{question_type.lower()}Questions'
        collection = db[collection_name]
        result = collection.insert_one(data)

        return Response({'_id': result.inserted_id}, status=200, content_type='application/json')

    except Exception as e:

        return jsonify(error=str(e)), 404


@questions_api.route('/<question_id>', methods=['PUT'])
def update_question(org, user_type, question_type, question_id):

    current_app.logger.debug(
        f'update_question: org={org}, user_type={user_type}, question_type={question_type}, question_id={question_id}')

    try:

        data = request.json
        data.update({'org': org})
        current_app.logger.debug(f'update_question: data={data}')

        client = pymongo.MongoClient()
        db = client[DB_NAME]

        collection_name = f'{question_type.lower()}Questions'
        collection = db[collection_name]
        result = collection.update_one(
            {'_id': ObjectId(question_id)}, {'$set': data})

        return jsonify({'modified': result.modified_count})

    except Exception as e:

        return jsonify(error=str(e)), 404


@questions_api.route('/<question_id>', methods=['PUT'])
def delete_question(org, user_type, question_type, question_id):

    current_app.logger.debug(
        f'delete_question: org={org}, user_type={user_type}, question_type={question_type}, question_id={question_id}')

    try:

        client = pymongo.MongoClient()
        db = client[DB_NAME]

        collection_name = f'{question_type.lower()}Questions'
        collection = db[collection_name]
        result = collection.delete_one({'_id': ObjectId(question_id)})

        return jsonify({'deleted': result.deleted_count})

    except Exception as e:

        return jsonify(error=str(e)), 404
