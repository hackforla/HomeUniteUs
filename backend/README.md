# Home Unite Us FastAPI Server

## Overview

This is the _Home Unite Us_ web API server.

This server uses:

- [FastAPI](https://fastapi.tiangolo.com/) - Web framework for API development
- [SQLAlchemy](https://www.sqlalchemy.org/) - ORM for database operations
- [Pydantic](https://docs.pydantic.dev/latest/) - Data validation and serialization
- [Poetry](https://python-poetry.org/docs/) - Dependency management

## Requirements

You will need Python 3.12+ to install Poetry.

Run `python -V` to check the Python version.

**Note**: On some systems, you might need to use the `python3` and `pip3` commands.

[Poetry](https://python-poetry.org/docs/#installation) is used to manage the project dependencies. Follow the [installation instructions](https://python-poetry.org/docs/#installation) to run the CLI globally.

[Docker](https://www.docker.com) is used to run required dependencies for development.

## Usage - Development

### Getting Started

#### Run Required Docker Containers

The API uses PostgreSQL and Moto server as it's basic required services. Using Docker Compose, run these containers prior to running the API using the following command:

```shell
docker compose up -d --build pgadmin motoserver  # Runs required docker services: PostgreSQL, Moto Server, pgAdmin4
```

The command above will run three containers. `pgAdmin4` is a convenient tool that wills developers to query the PostgreSQL database.

#### Configuration

The API configuration must be specified before running the application. Configuration variables are specified as entries within a `.env` file located within the `backend` directory. To get started, create a `.env` file within `/backend` and copy the values from `.env.example` into the new `.env` file.

#### Setup and Run API - non-Docker version

Once the `.env` file has been configured and Poetry is installed, run the following commands in the `backend` directory to install the required development dependencies and run the application.

```shell
poetry install                           # Installs all dependencies

poetry shell                             # Activates the virtual environment

poetry run uvicorn app.main:app --reload # Run the Fast API server

# If using a shell use this:
startup_scripts/entrypoint.sh            # Creates test users and runs the API in developer mode

# If using Powershell use this:
startup_scripts/entrypoint.ps1           # Creates test users and runs the API in developer mode
```

Your server is now running at:
```
http://localhost:8000
```

And your API docs at:
```
http://localhost:8000/docs
```

pgAdmin4 is available at:
```
http://localhost:5050/browser
```

Moto server dashboard is available at:
```
http://localhost:5000/moto-api
```

To exit the virtual environment, within the shell run:
```shell
exit
```

## Test Users

The `startup_scripts/entrypoint.sh` (or `startup_scripts/entrypoint.ps1` if using Powershell) script creates the following users.

The password for all test users is `Test123!`.

- 1 Admin: admin@example.com
- 26 Guests: guest[a-z]@example.com (e.g. `guesta@example.com`, `guestb@example.com`, ... `guestz@example.com`)
- 26 Coordinators: coordinator[a-z]@example.com (e.g. `coordinatora@example.com`, `coordinatorb@example.com`, ... `coordinatorz@example.com`)
- 26 Hosts: host[a-z]@example.com (e.g. `hosta@example.com`, `hostb@example.com`, ... `hostz@example.com`)

## Conventions

### API Endpoints

A path segment with spaces must be replace the spaces with a hyphen `-`. For example, `https://dev.homeunite.us/api/housing-orgs`.



## Testing

Ensure you have a virtual environment activated in the backend directory.

To run the backend tests:

 ```shell
 pytest
 ```

