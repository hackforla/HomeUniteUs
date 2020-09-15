# Home Unite Us

We're working with community non-profits who have a host home initiative to develop a workflow management tool to make the process scaleable (across all providers), reduce institutional bias, and effectively capture data.

Host home programs are centered around housing young people, 18 - 25 years old. Their approach focuses on low-cost, community-driven intervention by matching a willing host with a guest or group of guests, providing a stable housing environment for youths who are experiencing homelessness and seeking stable housing.

Come visit us at https://homeunite.us/

### Project context

This project is part of a larger initative at Hack for LA around creating a shared housing application, that can be used by organizations accross the county to help people tranisition to living independently and sustainably through host homes, empty bedrooms, and roomate matching for shared housing with lease signing.

### Technology used

- [Docker](https://docs.docker.com/)
<!-- - [Terraform](https://www.terraform.io/docs/index.html) -->
- [Nginx](https://nginx.org/en/docs/)
- [AWS](https://docs.aws.amazon.com/)
- [MongoDB](https://docs.mongodb.com/)
- [React](https://reactjs.org/docs/getting-started.html)
- [Styled Components](https://styled-components.com/docs)
- [Material UI](https://material-ui.com/)
- [Flask](https://flask.palletsprojects.com/en/1.1.x/)

# How to contribute

- Review the [Getting Started guide on the Hack for LA website](https://github.com/hackforla/getting-started)
- Review the documents in the [host-home shared drive](https://drive.google.com/drive/u/0/folders/1ahxiD9rIsBtx0yAPlPcPaGw8zGrfHHm9).
- Join the [#host-home slack channel](https://hackforla.slack.com/archives/CRWUG7X0C).
- Visit our [project boards](https://github.com/hackforla/HomeUniteUs/projects) and see issues in the prioritized backlog.

## Installation instructions

1. Step-by-step instructions help new contributors get a development environment up and running quickly.
2. You'll want to find the balance between being specific enough for novices to follow, without being so specific that you reinvent the wheel by providing overly-basic instructions that can be found elsewhere.
3. Feel free to adapt this section and its sub-sections to your own processes.
4. Alternatively, you can move everything from _Installation instructions_ through _Testing_ to a separate **Contributing.md** file to keep your **ReadMe.md** more succinct.

### Working with issues

- Explain how to submit a bug.
- Explain how to submit a feature request.
- Explain how to contribute to an existing issue.

To create a new issue, please use the blank issue template (available when you click New Issue). If you want to create an issue for other projects to use, please create the issue in your own repository and send a slack message to one of your hack night hosts with the link.

### Working with forks and branches

- Explain your guidelines here.

### Working with pull requests and reviews

- Explain your process.

### Testing

- Provide instructions.

# Contact info

Please join our [Slack channel](https://hackforla.slack.com/archives/CRWUG7X0C) and introduce yourself!

### Licensing

Include details about the project's open source status.

_this readme file sourced from [Jessica Sand](http://jessicasand.com/other-stuff/just-enough-docs/)_

# Local development environment

### Flask, Mongo and NPM

1. Ensure npm, mongodb and python3 are installed. Get the code:
   `git clone git@github.com/hackforla/HomeUniteUs`

2) Run server

1) `cd host-home`

1) `./seed-local-db.sh`

   - check that data was seeded correctly by printing first three guest objects: `mongoexport -d=hosthome -c=guests --jsonArray --pretty --limit=3`

1) 1. (Optional) Configure a conda or virtualenv project
   2. `pip install -r requirements.txt`

4. `python hosthome.py` to start server running

3) Run client

   1. `cd app`
   1. `npm install`
   1. `npm run dev` runs webpack dev server

### Docker

1. See the [README in 'scripts'](./scripts/README.md)
