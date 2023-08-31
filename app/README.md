# Home Unite Us Frontend App

Before getting started, make sure you have followed the instructions in the [CONTRIBUTING](../CONTRIBUTING.md) guide.

You will also need to ask a member of team for a copy of the `.env` file, and a Node.js version compatible with 14.18+, 16+. You can check your local version by running the following command in a terminal:

```terminal
node --version
```

## Local Build Instructions

1. Clone the repository to a directory on your computer
2. Inside a terminal change directories to the root ``HomeUniteUs/`` directory
3. Navigate to the the ``app/`` directory ``cd app/``
4. Run the command ```npm install``` to download all dependencies from the local package.json
5. Create a local ``.env`` file and copy the contents from ``.env.example``
6. Message a team member to obtain values for the .env file
7. From the ``app/`` directory run ``npm run dev`` to start a development server at ``http://127.0.0.1:4040/``

The setup for the front end application is now complete and you should see the website running in your browser at the listed port.

## Testing

Within this (`app`) directory, run the command: `npm test`.

## Configuration

This application can be configured using environment variables. Environment variables can be set in the shell environment prior to running any `npm run ...` commands or be placed into a `.env` file. This application loads the environment variables starting `VITE_` and the values are available in code as `import.meta.env.VITE_<rest of variable>`.

None of the environment variables are required or given a default value unless explicit made so with custom code in `vite.config.ts`.

For production builds, vite preforms a string replacement on the `import.meta.env.VITE_<rest of variable>` string with the value of the environment variable. If the variable is not required, doesn't get assigned a default value, and it is not defined before running the `npm run build` command, then `vite` will replace the `import.meta.env.VITE_<rest of variable>` string with `{}.VITE_<rest of variable>`. So be aware of potential bugs for missing environment variables.

The table below describes the environment variables that are used by this app:

| Variable          | Required? | Example                    | Description                                                                                                                                                                                                                                                                    |
|-------------------|-----------|----------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `VITE_HUU_API_BASE_URL` | YES       | http://localhost:4040/api/ | The HUU API's base URL. In a development environment (mode is 'development'): if this variable is not defined, then `http://localhost:4040/api/` will be used by default. In non-development environment: if this variable is not defined, then the build will throw an error. |
|                   |           |                            |                                                                                                                                                                                                                                                                                |
## Production

This application is statically compiled using `npm run build`. The files created by the build command are placed in a `dist` directory. Those files are then placed into a directory served by `Nginx`. The configuration environment variables are expected to exist prior to building this application.
