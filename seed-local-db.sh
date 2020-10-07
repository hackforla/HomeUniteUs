#!/bin/bash

# # v0: uncomment to import collections used for proof-of-concept
# collection_names=( \
#     guests \
#     hosts \
#     guestQuestions \
#     hostQuestions \
#     infoQuestions \
#     responseValues \
#     restrictions \
#     guestResponses \
#     hostResponses \
# )

collection_names=( \
    qualifyingQuestions \
    matchingQuestions \
    infoQuestions \
)

for c in "${collection_names[@]}"; do
    echo "============================================"
    echo "=== $c ==="
    echo "============================================"
    echo "- deleting collection"
    mongo --eval "db.$c.remove({});" hosthome
    echo "- importing data"
    mongoimport -c=$c -d=hosthome --jsonArray --file=data/seed/$c.json
done;
