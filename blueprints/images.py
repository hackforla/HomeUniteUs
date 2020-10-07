import json
from flask import Blueprint, render_template, abort, jsonify, current_app, request, Response
from jinja2 import TemplateNotFound
import pymongo
from bson import ObjectId
from config.constants import DB_NAME

images_api = Blueprint('images_api', __name__,
                       template_folder='templates')


@images_api.route('/', methods=['GET'])
def get_images(org, user_type, user_id, image_subject):

    current_app.logger.debug(
        f'get_images: org={org}, user_type={user_type}, image_subject={image_subject}')

    try:

        client = pymongo.MongoClient()
        db = client[DB_NAME]

        collection_name = f'{image_subject.lower()}Questions'
        collection = db[collection_name]

        cursor = collection.find({
            'org': org
        })

        images = list(cursor)

        for image in images:
            image['_id'] = str(image['_id'])

        return jsonify(images)

    except Exception as e:

        return jsonify(error=str(e)), 404


@images_api.route('/<image_id>', methods=['GET'])
def get_image_by_id(org, user_type, image_subject, image_id):

    current_app.logger.debug(
        f'get_images: org={org}, user_type={user_type}, image_subject={image_subject}')

    try:

        client = pymongo.MongoClient()
        db = client[DB_NAME]

        collection_name = f'{image_subject.lower()}Questions'
        collection = db[collection_name]

        cursor = collection.find({
            'org': org,
            '_id': ObjectId(image_id)
        })

        images = list(cursor)

        for image in images:
            image['_id'] = str(image['_id'])

        return jsonify(images)

    except Exception as e:

        return jsonify(error=str(e)), 404


@images_api.route('/', methods=['POST'])
def add_image(org, user_type, image_subject):

    current_app.logger.debug(
        f'get_images: org={org}, user_type={user_type}, image_subject={image_subject}')

    try:

        data = request.json
        data.update({'org': org})

        client = pymongo.MongoClient()
        db = client[DB_NAME]

        collection_name = f'{image_subject.lower()}Questions'
        collection = db[collection_name]
        result = collection.insert_one(data)

        return Response({'_id': result.inserted_id}, status=200, content_type='application/json')

    except Exception as e:

        return jsonify(error=str(e)), 404


@images_api.route('/<image_id>', methods=['PUT'])
def update_image(org, user_type, image_subject, image_id):

    current_app.logger.debug(
        f'update_image: org={org}, user_type={user_type}, image_subject={image_subject}, image_id={image_id}')

    try:

        data = request.json
        data.update({'org': org})
        current_app.logger.debug(f'update_image: data={data}')

        client = pymongo.MongoClient()
        db = client[DB_NAME]

        collection_name = f'{image_subject.lower()}Questions'
        collection = db[collection_name]
        result = collection.update_one(
            {'_id': ObjectId(image_id)}, {'$set': data})

        return jsonify({'modified': result.modified_count})

    except Exception as e:

        return jsonify(error=str(e)), 404


@images_api.route('/<image_id>', methods=['PUT'])
def delete_image(org, user_type, image_subject, image_id):

    current_app.logger.debug(
        f'delete_image: org={org}, user_type={user_type}, image_subject={image_subject}, image_id={image_id}')

    try:

        client = pymongo.MongoClient()
        db = client[DB_NAME]

        collection_name = f'{image_subject.lower()}Questions'
        collection = db[collection_name]
        result = collection.delete_one({'_id': ObjectId(image_id)})

        return jsonify({'deleted': result.deleted_count})

    except Exception as e:

        return jsonify(error=str(e)), 404
