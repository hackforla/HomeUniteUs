#!/bin/bash

DEPLOY=0

while [[ $# -gt 0 ]]; do
    case $1 in
        --deploy) DEPLOY=1;
            shift;
        ;;
        *) printf "\e[31margument not supported:\e[0m %s\n" $1
            shift;
        ;;
    esac;
done;

COMMIT_PREFIX="$(git log -n1 --pretty='%H' | head -c10)"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
ECR_REPO='035866691871.dkr.ecr.us-west-2.amazonaws.com/homeuniteus'

IMAGE_URL="${ECR_REPO}:${COMMIT_PREFIX}.${TIMESTAMP}"

docker buildx build \
    --platform "linux/amd64" \
    --tag "${IMAGE_URL}" \
    --file .incubator/app.Dockerfile \
    .

docker tag "${IMAGE_URL}" "${ECR_REPO}:latest"

if [[ $(( DEPLOY )) -gt 0 ]]; then

    docker push "${IMAGE_URL}"

    ESCAPED_IMAGE_URL=$(echo "${IMAGE_URL}" | sed 's/\//\\\//g')
    ECS_TASK_DEFINITION=$( sed "s/__IMAGE_URL__/${ESCAPED_IMAGE_URL}/g" < ./.incubator/ecs-taskdef-template.json )

    aws ecs register-task-definition \
        --cli-input-json "${ECS_TASK_DEFINITION}" \
        | tee ./ecs-taskdef-revision.json

    aws ecs update-service \
        --cluster incubator-prod \
        --service homeuniteus \
        --task-definition homeuniteus \
        --force-new-deployment

fi;