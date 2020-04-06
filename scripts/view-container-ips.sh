#!/bin/sh
host_home_containers=$(docker ps -a | tail -n+2 | grep "^.*host\-home.*$" | awk '{print $1}')
echo "Containers marked with image name 'host-home':"
for c in $host_home_containers; do
    container_ip=$(docker inspect -f '{{.NetworkSettings.IPAddress}}' $c)
    echo "- container $c is running at $container_ip"
done;