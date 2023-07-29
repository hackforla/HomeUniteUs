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

For development purposes, run the following commands in the `api/` directory to get started:

```shell
python -m venv .venv          # Creates a virtual environment in the `.venv` directory

# Activate the virtual environment
# If you have Linux/MacOS, then run the following command
source .venv/bin/activate
# Else if run cmd.exe, then run the following command
venv\Scripts\activate.bat
# Else if run PowerShell, then run the following command
venv\Scripts\Activate.ps1

pip install -e ".[dev]"       # Installs all of the dev dependencies and this code in editable mode
alembic upgrade head          # Initiates or update the local database
python -m openapi_server      # Runs this server
```

If you're seeing error messages, this may be related to missing environment variables. In the `api/` directory, create a `.env` file and copy and paste the variable definitions from `.env.example`. Message a team member to receive the necessary values.

and open your browser to here:

```
http://localhost:8080/api/ui/
```

Your OpenAPI definition lives here:

```
http://localhost:8080/api/openapi.json
```

### Testing

The `tox` tool was installed into your virtual environment using the `pip install -e ".[dev]"` above.

To launch the tests, run `tox`.

### Alembic migrations

When changing the database, you can automatically generate an alembic migration. Simply change the model however you want in `database.py`, run `alembic revision --autogenerate -m <name_of_migration>` to generate a new migration, and then run `alembic upgrade head` to upgrade your database to the latest revision.
In the case of someone else adding a revision to the database, simply pull their changes to your repo and run `alembic upgrade head` to upgrade your local database to the latest revision.

## Usage - Production

A WSGI server is needed to run our application. A WSGI (Web Server Gateway Interface) server is a bridge between a web server and web applications. The server handles requests, invokes the web application, translates responses back to HTTP, and also manages concurrency to ensure the server can handle multiple requests simultaneously.

While Flask does provide a built-in development server, it is not intended for production use. Therefore, we utilize a third-party, production-grade WSGI server to manage our application. Various options exist, but we've chosen `gunicorn`. `gunicorn` does not support Windows, but you can use another WSGI server like `waitress` if Windows support is needed.

WSGI servers like `gunicorn` require the python module to be installed on the system, in order to properly import the application class. To run the server, use pip to install `openapi_server` and then start the application from `gunicorn`.

Run the following commands in the shell, from the `api/` directory:

```shell
python -m venv .venv          # Creates a virtual environment in the `.venv` directory
source .venv/bin/activate     # Activate the virtual environment
pip install --upgrade pip     # Upgrade pip to latest version
pip install .[prod]           # Install openapi_server & prod dependencies into virtual env
gunicorn -w 4 "openapi_server.__main__:create_app()" # Launch production server!
```

The console output will provide the listening address, that you can visit through your browser.

## Running with Docker

To run the server on a Docker container, please execute the following from the root directory:

```bash
# building the image
docker build -t openapi_server .

# starting up a container
docker run -p 8080:8080 openapi_server
```

## Running with Docker Compose

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


## Configuration Profile
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

## Debugging

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
