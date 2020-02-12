
import sys
from flask import Flask, render_template, send_from_directory, request, jsonify
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


@app.route('/api/host', methods=['GET'])
def get_all_hosts():
    hosts = request.get_json()
    return { "hosts": hosts, "status": hosts.status_code }

@app.route('api/host/{id}', methods=['GET'])
def get_host_by_id(id: int):
    hosts = request.get_json()
    host_id = hosts[str(id)]
    host_output = host[host_id]
    return { "host": host_output, "status": hosts.status_code }


@app.route('/api/host', methods=['POST'])
def add_host():
    hosts = request.get_json()
    host.update(hosts)
    return { "hosts": hosts, }
    

@app.route('api/host/{id}', methods=['PUT'])
def update_host(id: int):
    hosts = request.get_json()
    try:
        host[str(id)] = hosts
    except Exception as e:
        raise e
    return { "host": host[str(id)], "status": hosts.status_code }



@app.route('api/host/{id}', methods=['DELETE'])
def delete_host(id: int):
    hosts  = request.get_json()
    host_id = hosts[str(id)]
    del host[host_id]
    if host[host_id] is None:
        success = "deleted!"
    else:
        success = "no"
    return { "success": success "status": hosts.status_code }

####guest routes
@app.route('/api/guest', methods=['GET'])
def get_all_guests():
    guests = request.get_json()
    return { "guests": guests, "status": guests.status_code }

@app.route('api/guest/{id}', methods=['GET'])
def get_host_by_id(id: int):
    guests = request.get_json()
    guest_id = guests[str(id)]
    guest_output = guest[guest_id]
    return { "guest": guest_output, "status": guests.status_code }


@app.route('/api/guest', methods=['POST'])
def add_host():
    guests = request.get_json()
    guest.update(guests)
    return { "guests": guests, }
    

@app.route('api/guest/{id}', methods=['PUT'])
def update_host(id: int):
    guests = request.get_json()
    try:
        guest[str(id)] = guests
    except Exception as e:
        raise e
    return { "guest": guest[str(id)], "status": guests.status_code }



@app.route('api/guest/{id}', methods=['DELETE'])
def delete_host(id: int):
    guests  = request.get_json()
    guest_id = guests[str(id)]
    del guest[guest_id]
    if guest[guest_id] is None:
        success = "deleted!"
    else:
        success = "no"
    return { "success": success "status": guests.status_code }




if __name__ == "__main__":    
    handler = logging.StreamHandler(sys.stdout)
    app.logger.addHandler(handler)
    app.logger.setLevel(logging.INFO)
    app.logger.warn('starting app...')
    app.run(host="0.0.0.0", port=8765, debug=True)