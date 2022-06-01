from typing import Dict
from flask import jsonify

# Format error reponse and append status code
class AuthError(Exception):
    def __init__(self, error: Dict[str, str], status_code):
        super().__init__()
        self.error = error
        self.status_code = status_code

def handle_auth_error(ex):
    response = jsonify(ex.error)
    response.status_code = ex.status_code
    return response 