#!/bin/sh


host_home_containers=$(docker ps -a | tail -n+2 | grep "^.*host\-home.*$" | awk '{print $1}')
echo "About to kill containers:"
echo $host_home_containers

for c in $host_home_containers; do
    echo "- killing $c"
    docker stop $c
    docker rm $c
done;

