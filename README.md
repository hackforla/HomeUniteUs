# Home Unite Us

Home Unite Us is a community developed web platform designed to support and scale the [host homes](https://www.pointsourceyouth.org/interventions/host-homes) initiative.

Host homes provide short-term housing interventions for young people, aged 18-25, who are experiencing homelessness for any variety of reasons. The process for matching youth with a temporary safe space can be challenging, but numerous organization have implemented programs tailored to the needs of their local area. These implementations can vary in their exact policies and procedures, but they are all driven by the core principles of the host homes initiative and they often share an overlapping set of technological needs.

The Home Unite Us team is working hard to create the technology that can meet those needs in a scalable fashion. Our pilot program allows guests and hosts to easily submit applications, and provides coordinators with a dashboard that makes the home matching process simpler. The stable version of Home Unite Us is at <https://homeunite.us/> and our most up to date beta features can be found at <https://dev.homeunite.us/>.

Interested in joining our team? See our [contribution guide](CONTRIBUTING.md) to get started!

## Project Context

This project is part of a larger initiative at Hack for LA around creating a shared housing application, that can be used by organizations across the county to help people transition to living independently and sustainably through host homes, empty bedrooms, and roommate matching for shared housing with lease signing.

## Technology Overview

The HomeUniteUs project is structured as a multi-[docker](https://docs.docker.com/) container application, with secret-protected access to networked resources. The project contains three containers, whose activities are coordinated using the `docker compose` configuration outlined in `docker-compose.yml`. The three containers are:

1. `app`: A frontend [React](https://reactjs.org/docs/getting-started.html) app developed using [TypeScript](https://www.typescriptlang.org/).
   * We use [Redux](https://redux.js.org/) to manage client state, with the [Redux Toolkit](https://redux-toolkit.js.org/) to simplify development.
   * We use the [Material UI](https://material-ui.com/) component library, for access to high quality UI components designed with accessibility in mind.
   * We use the [Vite](https://vitejs.dev/) build tool, for fast dev builds and optimized production builds.
2. `api`: A backend python [connexion](https://connexion.readthedocs.io/en/latest/) REST API, hosted on [AWS](https://docs.aws.amazon.com/).
   * We use `connexion` to simplify our API specification and validation. `connexion` uses the [OpenAPI](https://www.openapis.org/) [specification](https://spec.openapis.org/oas/v3.0.1.html) to map API URLs to specific python functions. It will handle routing, validation, security, and parameter passing when an API request is made. `connexion` also generates documentation for our API, and provides a useful user interface (at `{URL}/api/ui`) that can be used to easily interact with the API for development purposes. We use the variant of `connexion` that runs on top of [Flask](https://flask.palletsprojects.com/en/1.1.x/).
   * We use the [SQLAlchemy](https://www.sqlalchemy.org/) SQL toolkit and [Object-Relational Mapper (ORM)](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping). This serves as a developer-friendly layer between the python app and the database.
   * We use [gunicorn](https://gunicorn.org/) as our WSGI server. A WSGI server acts as a communication intermediary between an HTTP proxy and the Hone Unite Us API, handling client requests and passing them to the application, then returning the application's responses to the client.
   * We use [nginx](https://nginx.org/en/docs/) as our HTTP server. This “reverse proxy” sits in front of the WSGI server, and handles a number of complex web server tasks. It is capable of load balancing across the WSGI server works, managing TLS connections, serving static files, and more.
3. `db`: A [PostgreSQL](https://www.postgresql.org/) database container.
   * The database is stored as a docker volume, `db-data`.
   * If the volume is not found during spin-up, then an empty database volume will be created.

## Build Instructions

Before you can build the project, you will require a `.env` file containing access keys to the application third party services. Please message a team member on the [#home-unite-us slack channel](https://hackforla.slack.com/archives/CRWUG7X0C) once you've completed onboarding.

Since this project is dockerized, you can choose to either build the backend and frontend apps as docker containers or directly onto your local machine. This guide will focus on docker builds, but full local build and deployment instructions can be found on the [api](./api/README.md) and [app](./app/README.md) READMEs.

Also note that the code in this repo *should* build without issue on Linux, Windows, and MacOS. We do, however, utilize some Linux-only tools during deployment and primarily target the Linux platform.

### Docker Build

Building with Docker is the simplest option, and debugging applications within the container is also easy with [some configuration](https://code.visualstudio.com/docs/containers/debug-common).

#### Requirements

* A copy of the `.env` file described above
* An up-to-date installation of [docker](https://docs.docker.com/get-docker/)

#### Instructions

1. Place a copy of the `.env` file in the `\app` directory
2. Place a copy of the `.env` file in the `\api` directory
3. Build all three containers by running the `docker compose up` shell command from the root directory:
4. Verify there are no build errors, and open `localhost:4040` in any browser, to see the application

#### Testing

You can run the api test cases directly within the docker container. To do this, however, you'll need to find the find the docker container Id. You can do this by reviewing the output from `docker ps` or use the following Powershell commands.

```Powershell
# Find the container ids 
# (-a show all containers, -q only display ids, -f filter output)
$api_container_id = docker ps -aqf "name=homeuniteus-api"

# Install the additional testing requirements before running api tests
docker exec -it $api_container_id pip install -r test-requirements.txt
# Run api tests
docker exec $api_container_id pytest
```

Running the `app` tests will require building the application locally, and invoking the `npm test` command within the `\app` directory.
