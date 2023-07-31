# Home Unite Us

<img src="./app/src/img/favicon.png" title="HomeUniteUs" style="float: right; margin: 10px;"/>

Home Unite Us is a community developed web platform designed to support and scale the [host homes](https://www.pointsourceyouth.org/interventions/host-homes) initiative.

Host homes provide short-term housing interventions for young people, aged 18-25, who are experiencing homelessness for any variety of reasons. The process for matching youth with a temporary safe space can be challenging, but numerous organization have implemented programs tailored to the needs of their local area. These implementations can vary in their exactly policies and procedures, but they are all driven by the core principles of the host homes initiative and they often share an overlapping set of technological needs.

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
2. `api`: A backend python [Flask](https://flask.palletsprojects.com/en/1.1.x/) REST API, hosted on [AWS](https://docs.aws.amazon.com/).
   * We use [connexion](https://connexion.readthedocs.io/en/latest/) to simplify our API specification and validation. `connexion` uses a .yaml API specification to map API URLs to specific python functions within our `Flask` app, and will handle routing and parameter passing when an API request is made. `connexion` also generates documentation for our API, and provides a useful user interface (at `{URL}/api/ui`) that can be to easily interact with the API for development purposes.
   * We use the [SQLAlchemy](https://www.sqlalchemy.org/) SQL toolkit and [Object-Relational Mapper (ORM)](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping). This serves as a developer-friendly layer between the python app and the database.
   * We use [gunicorn](https://gunicorn.org/) as our WSGI server. A WSGI server acts as a communication intermediary between the web server and the `Flask` application, handling client requests and passing them to the application, then returning the application's responses to the client.
   * We use [nginx](https://nginx.org/en/docs/) as our HTTP server. This “reverse proxy” sits in front of the WSGI server, and handles a number of complex web server tasks. It is capable of load balancing across the WSGI server works, managing TLS connections, serving static files, and more.
3. `db`: A [PostgreSQL](https://www.postgresql.org/) database container.
   * The database is stored as a docker volume, `db-data`.
   * If the volume is not found during spin-up, then an empty database volume will be created.

## Build Instructions

Before you can build the project, you will require a `.env` file containing access keys to the application third party services. Please message a team member on the [#home-unite-us slack channel](https://hackforla.slack.com/archives/CRWUG7X0C) once you've completed onboarding.

Since this project is dockerized, you can choose to either build the backend and frontend apps as docker containers or directly onto your local machine. This guide is focused on docker builds. For instructions tailored towards local builds and deploying in a production environment, please refer to the [api README](api/README.md).

Also note that the code in this repo *should* build without issue on Linux, Windows, and MacOS. We do, however, utilize some Linux-only tools during deployment and primarily target the Linux platform.

### Docker Build

Building with Docker is the simplest option, and debugging applications within the container is also easy with [some configuration](https://code.visualstudio.com/docs/containers/debug-common).

Copy the `.env` file to the `\app` directory, and run the following command from the repository root directory.

```shell
docker compose up
```

### Requirements

Before getting started, make sure you have a Node.js version compatible with 14.18+, 16+ as well as Git. If you're unfamiliar with Git and the necessary workflows please checkout the Hack for LA [website project](https://github.com/hackforla/website) and get started there. You can check your local versions by running the following commands in a terminal:

```terminal
node --version
git --version
```

### Getting Started

1. Clone the repository to a directory on your computer
2. Inside a terminal change directories to the root ``HomeUniteUs/`` directory
3. Navigate to the the ``app/`` directory ``cd app/``
4. Run the command ```npm install``` to download all dependencies from the local package.json
5. Create a local ``.env`` file and copy the contents from ``.env.example``
6. Message a team member to obtain values for the .env file
7. From the ``app/`` directory run ``npm run dev`` to start a development server at ``http://127.0.0.1:4040/``

The setup for the front end application is now complete and you should see the website running in your browser at the listed port. In order to get the server running reference the instructions [here](https://github.com/hackforla/HomeUniteUs/tree/main/api). If you run into any issues please message one of our team members.
