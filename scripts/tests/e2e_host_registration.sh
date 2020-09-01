#!/bin/bash

HOST_EMAIL="$1"

if [ $# -eq 0 ]
  then
    echo "Usage: $0 <host email>"
    exit
fi

echo "creating host with email: $HOST_EMAIL"


response=$(curl http://localhost:8080/api/host/registration \
  --write-out ' %{http_code}' --silent \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email": "'$HOST_EMAIL'"}')

response_code=${response:(-3)}

if [ $response_code != "200" ]; then
  echo "Could not create account: $response"
  exit
fi

curl http://localhost:8080/api/host/registration/info \
  -X PUT \
  -H "Content-Type: application/json" \
  -d '{"email": "'$HOST_EMAIL'", "horses": 10 }'

curl http://localhost:8080/api/host/registration/contact \
  -X PUT \
  -H "Content-Type: application/json" \
  -d '{"email": "'$HOST_EMAIL'", "frogs": 10 }'

curl http://localhost:8080/api/host/registration/address \
  -X PUT \
  -H "Content-Type: application/json" \
  -d '{"email": "'$HOST_EMAIL'", "jellyfish": 10 }'

curl http://localhost:8080/api/host/registration/language \
  -X PUT \
  -H "Content-Type: application/json" \
  -d '{"email": "'$HOST_EMAIL'", "cats": 10 }'

curl http://localhost:8080/api/host/registration/gender \
  -X PUT \
  -H "Content-Type: application/json" \
  -d '{"email": "'$HOST_EMAIL'", "snakes": 10 }'


curl http://localhost:8080/api/host/registration/matching/1 \
  -X PUT \
  -H "Content-Type: application/json" \
  -d '{"email": "'$HOST_EMAIL'", "response": 10 }'

curl http://localhost:8080/api/host/registration/matching/2 \
  -X PUT \
  -H "Content-Type: application/json" \
  -d '{"email": "'$HOST_EMAIL'", "response": ["dog", "cat"] }'

curl http://localhost:8080/api/host/registration/qualifying/12 \
  -X PUT \
  -H "Content-Type: application/json" \
  -d '{"email": "'$HOST_EMAIL'", "response": 56 }'

