# Managing Host Home Docker containers for local development

### Step 0: Configure your local environment
1. Copy `.env.example` to a new `.env`, replacing with the correct values. This file is ignored by git

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

#### View container logs
```bash
./scripts/view-logs.sh
```

#### Shell into container
```bash
# get container id
container_id=$(docker ps -a | grep host-home | awk '{print $1}')

# open bash shell connection to container (interactive TTY)
docker container exec -ti $container_id /bin/bash
```

### Step 5: Update the React bundles in the container
```bash
./scripts/live-update-container.sh
```

### Step 6: Stop and delete the container
```bash
./scripts/stop-container.sh
```

### Advanced Docker scripting resources

* [Go Template language](https://golang.org/pkg/text/template/)


