from flask import Response

from openapi_server.models.database import Host, DataAccessLayer
from openapi_server.models.schema import host_schema, hosts_schema
from sqlalchemy import select

# create host in database
def create_host(body: dict) -> Response:
    with DataAccessLayer.session() as session:
        new_host = Host(name = body["name"])
        session.add(new_host)
        session.commit()
        return host_schema.dump(new_host), 201

def get_hosts() -> Response:
    with DataAccessLayer.session() as session:
        all_hosts = session.execute(select(Host)).scalars().all()
        return hosts_schema.dump(all_hosts), 200
