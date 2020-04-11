#!/bin/sh

#in app folder run  

    # npm run build:docker

#and then run 

    # ./start-container.sh

#from root directory

host_home_containers=$(docker ps -a | tail -n+2 | grep "^.*host\-home.*$" | awk '{print $1}')
echo "About to copy new webpack bundles to container(s):"
echo $host_home_containers

for c in $host_home_containers; do
    docker cp app/dist $c:/app/
done;