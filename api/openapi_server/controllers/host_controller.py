import traceback
import connexion

from openapi_server.models.host import Host
from openapi_server.models import database as db
from sqlalchemy.orm import Session
from sqlalchemy.ext.serializer import loads, dumps

db_engine = db.DataAccessLayer.get_engine()

# create host in database
def create_host():
    if connexion.request.is_json:
        try:
            host = Host.from_dict(connexion.request.get_json()).to_dict()
            print(host)
        except ValueError:
            return traceback.format_exc(ValueError), 400
    
    with Session(db_engine) as session:
      row = db.Host(
        name=host["name"]
      )

      session.add(row)
      session.commit()

      host["id"] = row.id
      return Host.from_dict(host), 201

def get_hosts():
    resp = []

    with Session(db_engine) as session:
        table = session.query(db.Host)

        for row in table:
            host = Host(id=row.id, name=row.name).to_dict()
            resp.append(Host.from_dict(host))

    return resp, 200
