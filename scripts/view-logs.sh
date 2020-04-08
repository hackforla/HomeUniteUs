#!/bin/sh


host_home_containers=$(docker ps -a | tail -n+2 | grep "^.*host\-home.*$" | awk '{print $1}')
echo $host_home_containers

for c in $host_home_containers; do
    echo "----- BEGIN Logs for container $c -----"
    docker container logs $c
    echo "----- END Logs for container $c -----"
done;
