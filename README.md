# Home Unite Us

We're working with community non-profits who have a host home initiative to develop a workflow management tool to make the process scalable (across all providers), reduce institutional bias, and effectively capture data.

Host home programs are centered around housing young people, 18 - 25 years old. Their approach focuses on low-cost, community-driven intervention by matching a willing host with a guest or group of guests, providing a stable housing environment for youths who are experiencing homelessness and seeking stable housing.

Come visit us at <https://homeunite.us/>

## Project Context

This project is part of a larger initiative at Hack for LA around creating a shared housing application, that can be used by organizations across the county to help people transition to living independently and sustainably through host homes, empty bedrooms, and roommate matching for shared housing with lease signing.

## Technology Overview

The HomeUniteUs project is structured as a multi-[docker](https://docs.docker.com/) container application, with secret-protected access to networked resources. The project contains three containers, whose activities are coordinated using the `docker compose` configuration outlined in `docker-compose.yml`. The three containers are:

1. `app`: A frontend [React](https://reactjs.org/docs/getting-started.html) app developed using [TypeScript](https://www.typescriptlang.org/).
   * We use [Redux](https://redux.js.org/) to manage client state, with the [Redux Toolkit](https://redux-toolkit.js.org/) to simplify development.
   * We use the [Material UI](https://material-ui.com/) component library, for access to high quality UI components designed with accessibility in mind.
   * We use the [Vite](https://vitejs.dev/) build tool, for fast dev builds and optimized production builds.
2. `api`: A backend python [Flask](https://flask.palletsprojects.com/en/1.1.x/) REST API, hosted on [AWS](https://docs.aws.amazon.com/).
   * We use the [SQLAlchemy](https://www.sqlalchemy.org/) SQL toolkit and [Object-Relational Mapper (ORM)](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping). This essentially serves as a developer-friendly layer between the python app and the database.
   * We use [nginx](https://nginx.org/en/docs/) as our HTTP server. This “reverse proxy” can handle incoming requests, TLS, and other security and performance concerns better than the WSGI server.
3. `db`: A [PostgreSQL](https://www.postgresql.org/) database container.
   * The database is stored as a docker volume, `db-data`.
   * If the volume is not found during spin-up, then an empty database volume will be created.

### Testing

- Provide instructions.

## Installation Instructions

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
