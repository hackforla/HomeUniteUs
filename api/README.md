# Home Unite Us OpenAPI Server

## Overview

This is the *Home Unite Us* web API server.

This server uses the [Connexion](https://github.com/zalando/connexion) framework on top of Flask.

It uses the [OpenAPI-Spec](https://openapis.org) to document the API it implements.

## Requirements

Python >= 3.10

Run `python -V` to check the Python version.

**Note**: On some systems, you might need to use the `python3` and `pip3` commands.

## Usage - Development

### Getting Started

For development purposes, run the following commands in the `api` directory to get started:

```shell
python -m venv .venv          # Creates a virtual environment in the `.venv` directory

# Activate the virtual environment
# If you have Linux/MacOS, then run the following command
source .venv/bin/activate
# Else if run cmd.exe, then run the following command
venv\Scripts\activate.bat
# Else if run PowerShell, then run the following command
venv\Scripts\Activate.ps1

pip install --upgrade pip
pip install -r requirements-dev.txt  # Installs all of the dependencies for development
alembic upgrade head                 # Initiates or update the local database
python -m openapi_server             # Runs this server in developer mode
```

The console output will provide the listening address that you can visit through your browser.

If you're seeing error messages, this may be related to missing environment variables. In the `api` directory, create a `.env` file and copy and paste the variable definitions from `.env.example`. Message a team member to receive the necessary values.

and open your browser to here:

```
http://localhost:8080/api/ui/
```

Your OpenAPI definition lives here:

```
http://localhost:8080/api/openapi.json
```

### Testing

The `tox` tool was installed into your virtual environment using the `pip install -r requirements-dev.txt` command from above.

To launch the tests, run `tox`.

`tox` will run the tests for this (`api`) project using `pytest` in an isolated virtual environment that is distinct from the virtual environment that you created following the instructions from [Usage - Development](#usage---development).

### Alembic migrations

When changing the database, you can automatically generate an alembic migration. Simply change the model however you want in `database.py`, run `alembic revision --autogenerate -m <name_of_migration>` to generate a new migration, and then run `alembic upgrade head` to upgrade your database to the latest revision.
In the case of someone else adding a revision to the database, simply pull their changes to your repo and run `alembic upgrade head` to upgrade your local database to the latest revision.

### Dependency Management

Core dependencies of this project are listed in `pyproject.toml` under the `[project]` table's `dependencies` key. Additionally, this project has two extra variants, `dev` and `prod`, that add to the core dependencies. The `dev` extra variant installs dependencies for developers. The `prod` extra variant installs dependencies for production.

To aid in testing and building a reproducible, predictable, and deterministic API, this project also includes auto-generated requirements files that contains a list of all core and transitive dependencies with pinned versions. These files are:

* `requirements.txt` for a base set dependencies
* `requirements-dev.txt` that also includes developer dependencies

Developers will use `pip install -r requirements-dev.txt` in their own Python virtual environment when working on this API.

These files are auto-generated using the `pip-tools` command line tool `pip-compile`. That tool reads the core dependencies listed `pyproject.toml` then writes the generated list of pinned versions for all of the core and transitive dependencies to a requirements file. The instructions for updating dependencies is in `pyproject.toml`.

#### Keeping dependencies in sync

When switching branches or pulling changes, use the `pip-sync requirements-dev.txt` command to keep your virtual environment synchronized with the latest requirements file.

### Using Docker

#### Running with Docker

To run the server on a Docker container, please execute the following from the root directory:

```bash
# building the image
docker build -t openapi_server .

# starting up a container
docker run -p 8080:8080 openapi_server
```

#### Running with Docker Compose

If it's your first time running/building the containers run the following command from the root directory:

```
docker compose up api --build
```

This command will build and start both the api and db containers. You can check they are running by with:

```
docker ps
```

You should see two containers running with the names `homeuniteus-api-1` and `homeuniteus-db-1`. For subsequent runs you can simply run:

```
docker compose up api
```

To stop the containers run:

```
docker compose down
```

If you would like to interact with the postgres database you can run. Make sure you have the postgres client installed on your machine and have the database container running. Then use the command:

```
docker exec -it homeuniteus-db-1 psql -U postgres -W huu
```

This will prompt you for a password. The password is `postgres`. You can see this information in the `docker-compose.yml` file. This starts a new psql session. You can then run any psql commands you would like. For example, to see all the tables in the database run:

```
\dt
```

or to select all the users from the `user` table run:

```
SELECT * FROM public.user;
```

to end the session just type `\q`.

If you want to clear the databse and start from scratch you can run:

```
docker compose down -v
```

This command will stop the containers and delete the volumes. Then you can run `docker compose up api --build` to build and start the containers again.

#### Testing in a Docker Container

You can run the api test cases directly within the docker container. To do this, get the docker container Id by reviewing the output from `docker ps` or use the following Powershell or shell commands.

```Powershell
# Find the container id (result will be empty if container is not running)
# (-q only display ids, -f filter output)
$api_container_id = docker ps -qf "ancestor=homeuniteus-api"

# Run api tests within the container
docker exec $api_container_id pytest
```

```bash
# Find the container id (result will be empty if container is not running)
# (-q only display ids, -f filter output)

# Run api tests within the container
docker exec `docker ps -qf "ancestor=homeuniteus-api"` pytest
```

### Configuration Profile
For local development, you can create your own set of configurations by doing the following:
- Add the variable below to your `.env` located in `/api`.
```
CONFIG_PROFILE="personal"
```
- Create the file `personal.py` at `/api/configs` with the following,
```
from configs.configs import Config
class PersonalConfig(Config):
    # Example config to override HOST
    HOST = 8082
```
To reference configs in other modules you can do the following if it doesn't exist already,
```
from flask import current_app
current_app.config['CONFIG']
```
If you create any new configuration properties, please add an associative enum to `/api/configs/configuration_properties.py`.

### Debugging

For Visual Studio Code users:
- Set breakpoint(s).
- Add the following config below to `api/openapi_server/.vscode/launch.json` and replace "absolute path to folder" accordingly.

```
{
          "name": "Python: Connexion",
            "type": "python",
            "request": "launch",
            "module": "connexion",
            "cwd": "${workspaceFolder}",
            "env": {
                "FLASK_APP": "openapi_server.__main__.py",
                "FLASK_ENV": "development",
                "FLASK_DEBUG": "1"
            },
            "args": [
                "run",
                "< absolute path to folder >/openapi_server",
                "--port",
                "8080"
            ],
        }
```
- Go to `openapi_server/__main__.py` and select "Run" -> "Start with Debugging".

## Usage - Production

A WSGI server is needed to run our application. A WSGI (Web Server Gateway Interface) server is a bridge between a web server and web applications. The server handles requests, invokes the web application, translates responses back to HTTP, and also manages concurrency to ensure the server can handle multiple requests simultaneously.

While Flask does provide a built-in development server, it is not intended for production use. Therefore, we utilize a third-party, production-grade WSGI server to manage our application. Various options exist, but we've chosen `gunicorn`. `gunicorn` does not support Windows, but you can use another WSGI server like `waitress` if Windows support is needed.

WSGI servers like `gunicorn` require the python module to be installed on the system, in order to properly import the application class. The general method to run the server with `gunicorn` has the following form:

```bash
# The string tells gunicorn where to obtain the application object to run.
# In this case, the application object is constructed and returned by the `create_app`
# function defined in the `__main__.py` module.
gunicorn "openapi_server.__main__:create_app()"
```

`gunicorn` can communicate over a network socket or a unix socket. See the [gunicorn deploy](https://docs.gunicorn.org/en/latest/deploy.html) documentation for options.

### Deployment

The demo environment is an AWS EC2 instance running Ubuntu. On the Ubuntu EC2 instance, `systemd` manages the services required to run the frontend application, backend application, HTTP server/proxy, and database:

1. `postgresql.service` - Runs the PostgreSQL database
2. `nginx.service` - handles HTTPS termination, serves this API and the front-end application
3. `dev-homeuniteus-api.service` - runs this API via `gunicorn` with a unix socket that `nginx` uses
4. `pgAdmin.service` - runs the pgAdmin4 application for developers to check the database contents

For this API, a GitHub deployment workflow (found in .github/workflows) creates a Python `sdist` (Source Distribution) containing only the required files necessary for deployment, uploads it, installs the API, and restarts the `dev-homeuniteus-api` service.

The Swagger UI for the API on the demo environment is at https://dev.homeunite.us/api/ui

