from connexion.apps.flask_app import FlaskJSONEncoder

class JSONEncoder(FlaskJSONEncoder):
    include_nulls = False

    def default(self, o):
        return FlaskJSONEncoder.default(self, o)
