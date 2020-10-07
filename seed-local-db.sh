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

# OS=$(uname -s)
# case $OS in
#   'WindowsNT')
#     OS='Windows'
#     echo "$OS is where its at!!"
#     for c in "${collection_names[@]}"; do
#         echo "- importing data for collection: $c"
#         "mongoimport.exe" -c=$c -d=hosthome --jsonArray --file="data/$c.json"
#     done;
#     ;;
#   'Linux')
#     OS='Linux'
#     echo "$OS is the BEST"
#     for c in "${collection_names[@]}"; do
#         echo "- importing data for collection: $c"
#         "mongoimport.exe" -c=$c -d=hosthome --jsonArray --file=data/$c.json
#     done;
#     ;;
#   'Darwin') 
#     OS='Mac'
#     echo "Nice! You got a $OS"
#     for c in "${collection_names[@]}"; do
#         echo "- importing data for collection: $c"
#         mongoimport -c=$c -d=hosthome --jsonArray --file=data/$c.json
#     done;
#     ;;
#   *) ;;
# esac
