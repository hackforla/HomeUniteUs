#!/bin/sh
LOG_PATH="$(pwd)/host-home.log"
echo "starting host home container, logging to $LOG_PATH..."
docker run -p 80:80 host-home > hosthome.log 2>&1 &

sleep 5
host_home_containers=$(docker ps -a | tail -n+2 | grep "^.*host\-home.*$" | awk '{print $1}')

for c in $host_home_containers; do
    container_ip=$(docker inspect -f '{{.NetworkSettings.IPAddress}}' $c)
    echo "- container $c is running at $container_ip"
done;
