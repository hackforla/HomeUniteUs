#!/bin/bash

collection_names=( \
    guests \
    hosts \
    guestQuestions \
    hostQuestions \
    responseValues \
    restrictions \
    guestResponses \
    hostResponses \
)

for c in "${collection_names[@]}"; do
    echo "- importing data for collection: $c"
    mongoimport -c=$c -d=hosthome --jsonArray --file=data/$c.json
done;
