#!/usr/bin/env python3

import connexion

from openapi_server import encoder
from openapi_server.models.api_response import ApiResponse  # noqa: E501
from openapi_server.models.database import HousingProgramServiceProvider, DataAccessLayer
from sqlalchemy import select
from sqlalchemy.orm import Session

def add_provider(provider_name):

    dal = DataAccessLayer()
    dal.db_init()

    with Session(dal.engine) as session:

        provider = HousingProgramServiceProvider(
            provider_name=provider_name
        )

        session.add(provider)
        session.commit()


def list_providers():

    dal = DataAccessLayer()
    dal.db_init()

    with Session(dal.engine) as session:
        statement = select(HousingProgramServiceProvider)

        print(f'list_providers: results:')
        for provider in session.scalars(statement):
            print(f'- provider: {provider}')



def main():
    app = connexion.App(__name__, specification_dir='./openapi/')
    app.app.json_encoder = encoder.JSONEncoder
    app.add_api('openapi.yaml',
                arguments={'title': 'Home Unite Us'},
                pythonic_params=True)

    app.run(port=8080)


if __name__ == '__main__':
    main()
    