# Home Unite Us Frontend App

Before getting started, make sure you have followed the instructions in the [CONTRIBUTING](../CONTRIBUTING.md) guide.

You will also need to ask a member of team for a copy of the `.env` file, and a Node.js version compatible with 20+. You can check your local version by running the following command in a terminal:

```terminal
node --version
```

The minimum node version enforced is currently 20+, which is the current LTS version of Node.js. This is checked before installation is complete, per the `engines` section, `preinstall` and `check-node-version` scripts in `package.json`. If you are unable to complete npm install, please double check to see that you are using the minimum supported version.

## Local Build Instructions

1. Clone the repository to a directory on your computer
2. Inside a terminal change directories to the root `HomeUniteUs/` directory
3. Navigate to the the `frontend/` directory: `cd frontend/`
4. Run the command `npm install` to download all dependencies from the local package.json
5. Create a local `.env` file and copy the contents from `.env.example`
6. Message a team member to obtain values for the .env file
7. From the `frontend/` directory run `npm run dev` to start a development server at `http://127.0.0.1:4040/`

The setup for the front end application is now complete and you should see the website running in your browser at the listed port.

## Testing

The frontend app leverages two different testing frameworks.

### Component testing

Isolated component-level tests are written using [vitest](https://vitest.dev/guide/why.html), a Vite-native test framework that is optimized for testing the individual units of code in isolation, typically functions and components, rather than the entire application with full user interactions.

Existing tests can be executed by running `npm test` within the (`app`) directory. New tests can be added within files with the `.test.tsx` or `.test.ts` extension. We store our test cases alongside the associated source code files, within `__test__` subdirectories.

### End-to-end (e2e) testing

Integrated browser based tests are written using [Cypress](https://docs.cypress.io/guides/overview/why-cypress). `Cypress` allows you to write tests that interact with our web application in the same way that a user would, by running tests in a real browser against an actual backend.

By default we mock out backend integration by intercepting and simulating responses from the backend, however the mocking can be removed if real user credentials are provided as environment variables.

```pwsh
cd app
# Launch app before testing
npm run dev
# Run tests with mocking. The backend does not need to be running.
npm run cypress:open
# Run tests without mocking, using a real user account
$env:CYPRESS_REAL_EMAIL = "put-your-real-user-here@aol.com"
$env:CYPRESS_REAL_PASSWORD = "Quantum-encrypted-p@ssw0rd-here"
npm run cypress:open:nomock
```

If the e2e tests are not working as expected then verify the `cypress.config.ts` `defineConfig.e2e.baseUrl` matches the deployed app's base url.

## Configuration

This application can be configured using environment variables. Environment variables can be set in the shell environment prior to running any `npm run ...` commands or be placed into a `.env` file. This application loads the environment variables starting `VITE_` and the values are available in code as `import.meta.env.VITE_<rest of variable>`.

None of the environment variables are required or given a default value unless explicit made so with custom code in `vite.config.ts`.

For production builds, vite preforms a string replacement on the `import.meta.env.VITE_<rest of variable>` string with the value of the environment variable. If the variable is not required, doesn't get assigned a default value, and it is not defined before running the `npm run build` command, then `vite` will replace the `import.meta.env.VITE_<rest of variable>` string with `{}.VITE_<rest of variable>`. So be aware of potential bugs for missing environment variables.

The table below describes the environment variables that are used by this app:

| Variable                | Required? | Example                    | Description                                                                                                                                                                                                                                                                              |
| ----------------------- | --------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VITE_HUU_API_BASE_URL` | YES       | http://localhost:8080/api/ | The HUU API's base URL. In a development environment (mode is 'development' or 'test'): if this variable is not defined, then `http://localhost:4040/api/` will be used by default. In non-development environment: if this variable is not defined, then the build will throw an error. |
|                         |           |                            |                                                                                                                                                                                                                                                                                          |

## Production

This application is statically compiled using `npm run build`. The files created by the build command are placed in a `dist` directory. Those files are then placed into a directory served by `Nginx`. The configuration environment variables are expected to exist prior to building this application.

## Folder Structure

The `frontend/` directory is organized as follows:

- `src/` - Tthe source code for the frontend application
  - `features/` - Contains the components for the application organized by feature as well as a `/ui` for shared components
    - `feature/` - Inside the features folder are folders containing components for a specific feature along with any other required files.
      - `hooks/` - Hooks related to the feature
      - `helpers/` - Helper functions related to the feature
      - `__tests__` - Tests for components in the feature
  - `pages/` - Contains all pages that are rendered by the application. These can be organized by features and contain `hooks/`, `helpers/`, and `__tests__` subfolders as well.
  - `hooks/` - Hooks that are shared across the application
  - `redux/` - Cotains the redux store, state slices, and helpers for the application
  - `services/` - Code related to interfacing with any external APIs
  - `theme/` - Any files related to MUI theming and overrides
  - `utils/` - All utility functions used throughout the application
