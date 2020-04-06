# Managing Host Home Docker containers for local development

### Step 0: Configure your local environment
1. Copy `.env.example` to a new `.env`, replacing with the correct values. This file is ignored by git
2. Repeat step 1 for the `.env.example` file inside the `app` directory

### Step 1: Build the base image
Note: this script is separated out because it installs dependencies, downloads OS images, etc.. Whenever new dependencies are introduced at the server level, the approprate configs/manifests must be updated and this script re-run for all developers.
```bash
./scripts/build-base-img.sh
```

### Step 2: Build the application image
Note: This script will run the Webpack build, and copy those bundles along with the Flask code into the base image. For any changes that are purely client-side, or simple Python code changes, this script will redeploy as expected.
```bash
./scripts/build-img.sh
```

### Step 3: Start the container
Simple helper script to launch the container and print the IP address to the console (usually 172.17.0.2 per Docker convention)
```bash
./scripts/start-container.sh
```

### Step 4: Debug runtime issues
```bash

```

#### View container logs

#### Shell into container

### Step 5: Update the React bundles in the container

### Step 6: Stop the container

### Advanced Docker scripting resources

##### Go Template language

https://golang.org/pkg/text/template/

