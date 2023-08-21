from flask import Response

from openapi_server.models.database import hostSchema, hostsSchema, Host, DataAccessLayer

# create host in database
def create_host(body: dict) -> Response:
    with DataAccessLayer.session() as session:
        new_host = Host(name = body["name"])
        session.add(new_host)
        session.commit()
        _ = new_host.id
        return hostSchema.dump(new_host), 201

def get_hosts() -> Response:
    with DataAccessLayer.session() as session:
        all_hosts = session.query(Host).all()
        return hostsSchema.dump(all_hosts), 200
