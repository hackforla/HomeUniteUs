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

## Usage - Development

### Getting Started

#### Configuration

The API configuration must be specified before running the application. Configuration variables are specified as entries within a `.env` file located within the `backend` directory. To get started, create a `.env` file within `/backend` and copy the values from `.env.example` into the new `.env` file.

#### Setup and Run - non-Docker version

Once the `.env` file has been configured and Poetry is installed, run the following commands in the `backend` directory to install the required development dependencies and run the application.

```shell
poetry install                      # Installs all dependencies

poetry shell                        # Activates the virtual environment

poetry run fastapi dev app/main.py  # Runs this server in developer mode
```

Your server is now running at:
```
http://127.0.0.1:8000
```

And your API docs at:
```
http://127.0.0.1:8000/docs
```

To exit the virtual environment, within the shell run:
```shell
exit
```

## Conventions

### API Endpoints

A path segment with spaces must be replace the spaces with a hyphen `-`. For example, `https://dev.homeunite.us/api/housing-orgs`.
