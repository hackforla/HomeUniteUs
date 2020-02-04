
import sys
from flask import Flask, render_template, send_from_directory
import logging
from logging.config import dictConfig

dictConfig({
    'version': 1,
    'formatters': {'default': {
        'format': '%(message)s',
    }},
    'handlers': {'wsgi': {
        'class': 'logging.StreamHandler',
        'stream': 'ext://sys.stdout',
        'formatter': 'default'
    }},
    'root': {
        'level': 'INFO',
        'handlers': ['wsgi']
    }
})

app = Flask(
    __name__,
    static_url_path='',
    static_folder='dist',
    template_folder='dist'
)


@app.route('/favicon.ico')
def favicon():
    return send_from_directory(
        app.root_path, 
        'favicon.ico', 
        mimetype='image/vnd.microsoft.icon'
    )


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    app.logger.warn('path = {}'.format(path))
    return app.send_static_file("index.html")

if __name__ == "__main__":    
    handler = logging.StreamHandler(sys.stdout)
    app.logger.addHandler(handler)
    app.logger.setLevel(logging.INFO)
    app.logger.warn('starting app...')
    app.run(host="0.0.0.0", port=8765, debug=True)