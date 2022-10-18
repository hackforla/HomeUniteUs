import traceback
import connexion

from openapi_server.models import database as db
from sqlalchemy.orm import Session
from sqlalchemy.ext.serializer import loads, dumps

db_engine = db.DataAccessLayer.get_engine()

# create host in database
def create_host():
    if connexion.request.is_json:
        try:
            host = connexion.request.get_json()
            print(host)
        except ValueError:
            return traceback.format_exc(ValueError), 400
    
    with Session(db_engine) as session:
      row = db.Host(
        name=host["name"]
      )

      session.add(row)
      session.commit()

      return {"id": row.id}, 201

def get_hosts():
    with Session(db_engine) as session:
        query = session.query(db.Host)

        serialized = dumps(query)

        return query.all()
