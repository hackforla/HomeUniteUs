import json
from flask import Blueprint, render_template, abort, jsonify, current_app, request, Response
from jinja2 import TemplateNotFound
import pymongo
from bson import ObjectId
from config.constants import DB_NAME