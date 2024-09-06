# Home Unite Us OpenAPI Server

## Overview

This is the _Home Unite Us_ web API server.

This server uses:

- [FastAPI](https://fastapi.tiangolo.com/).
- [SQLAlchemy](https://www.sqlalchemy.org/).
- [Pydantic](https://docs.pydantic.dev/latest/).
- [Poetry](https://python-poetry.org/docs/).

## Requirements

Python >= 3.12

Run `python -V` to check the Python version.

**Note**: On some systems, you might need to use the `python3` and `pip3` commands.

[Poetry](https://python-poetry.org/docs/#installation) is used to manage the project dependencies. Install the CLI globally.

## Usage - Development

### Getting Started

#### Configuration

The API application configuration must be specified before running the application. Configuration variables can be specified either as environment variables, or as entries within a `.env` file located within the `api` directory. To get started, copy the values from one of these configurations into a `.env` file:

#### Setup and Run

Once the `.env` file has been configured using the instructions outlined above and Poetry is installed, run the following commands in the `api` directory to install the required development dependencies and run the application.

```shell
poetry install                      # Installs all dependencies

poetry shell                        # Activates the virtual environment

poetry run fastapi dev app/main.py  # Runs this server in developer mode
```

To exit the virtual environment, run from the shell:

```shell
exit
```

Your server is now running at:

```
http://127.0.0.1:8000
```

And your API docs at:

```
http://127.0.0.1:8000/docs
```
