# Home Unite Us

Home Unite Us is a community developed web platform designed to support and scale the [host homes](https://www.pointsourceyouth.org/interventions/host-homes) initiative.

Host homes provide short-term housing interventions for young people, aged 18-25, who are experiencing homelessness for any variety of reasons. The process for matching youth with a temporary safe space can be challenging, but numerous organization have implemented programs tailored to the needs of their local area. These implementations can vary in their exact policies and procedures, but they are all driven by the core principles of the host homes initiative and they often share an overlapping set of technological needs.

The Home Unite Us team is working hard to create the technology that can meet those needs in a scalable fashion. Our pilot program allows guests and hosts to easily submit applications, and provides coordinators with a dashboard that makes the home matching process simpler. The stable version of Home Unite Us is at <https://homeunite.us/> and our most up to date beta features can be found at <https://dev.homeunite.us/>.

Interested in joining our team? See our [contribution guide](CONTRIBUTING.md) to get started!

## Project Context

This project is part of a larger initiative at Hack for LA around creating a shared housing application, that can be used by organizations across the county to help people transition to living independently and sustainably through host homes, empty bedrooms, and roommate matching for shared housing with lease signing.

## Technology Overview

The HomeUniteUs project is structured as a multi-[docker](https://docs.docker.com/) container application, with secret-protected access to networked resources. The project contains five containers, whose activities are coordinated using the `docker compose` configuration outlined in `docker-compose.yml`. The five containers are:

1. `frontend`: A frontend [React](https://reactjs.org/docs/getting-started.html) app developed using [TypeScript](https://www.typescriptlang.org/).
   * It uses [Redux](https://redux.js.org/) to manage client state, with the [Redux Toolkit](https://redux-toolkit.js.org/) to simplify development.
   * It uses the [Material UI](https://material-ui.com/) component library, for access to high quality UI components designed with accessibility in mind.
   * It uses the [Vite](https://vitejs.dev/) build tool, for fast dev builds and optimized production builds.
2. `backend`: A backend python API, hosted on [AWS](https://docs.aws.amazon.com/).
   * It uses `FastAPI` as its web framework.
   * It uses the [SQLAlchemy](https://www.sqlalchemy.org/) SQL toolkit and [Object-Relational Mapper (ORM)](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping). This serves as a developer-friendly layer between the Python app and the database.
3. `db`: A [PostgreSQL](https://www.postgresql.org/) database container.
   * The database is stored as a docker volume, `db-data`.
   * If the volume is not found during spin-up, then an empty database volume will be created.
4. `motoserver`: A development tool. It runs  [`moto`](http://docs.getmoto.org/en/latest/docs/server_mode.html) in Server Mode.
   * It allows developers to mock AWS so that AWS secrets are not needed for local development. This tool is used because HUU uses AWS Cognito as its identity and access provider. However, most local development will not need to make actual calls to AWS Cognito for HUU feature development. Using this tool will allow developers to login to HUU on their development machine.
   * It has a dashboard located at http://127.0.0.1:5000/moto-api/
5. `pgadmin`: An optional development tool. It is a container running [pgAdmin4](https://www.pgadmin.org/). pgAdmin4 is database administration and development platform for PostgreSQL.
    * This tool will allow can be used to run queries against the PostgreSQL server running in the `db` container.
    * It is accessed by going to http://127.0.0.1:5050

## Build Instructions

Since this project is Dockerized, you can choose to either build the backend and frontend apps as Docker containers or directly onto your local machine. This guide will focus on Docker builds, but full local build and deployment instructions can be found in the [api](./backend/README.md) and [app](./frontend/README.md) READMEs.

Also note that the code in this repo *should* build without issue on Linux, Windows, and MacOS. We do, however, utilize some Linux-only tools during deployment and primarily target the Linux platform.

### Docker Build

Building with Docker is the simplest option, and debugging applications within the container is also easy with [some configuration](https://code.visualstudio.com/docs/containers/debug-common).

#### Requirements

* An up-to-date installation of [Docker](https://docs.docker.com/get-docker/)

#### Instructions

1. Build and run all containers by running the `docker compose up --build` shell command from the root directory:
2. Verify there are no build errors. If there are build errors, reach out to the development team.
3. Open `http://localhost:34828` in any browser to use Home Unite Us.

## Testing Instructions

Testing instructions for each application are in the [backend](./backend/README.md) and [frontend](./frontend/README.md) README files.
