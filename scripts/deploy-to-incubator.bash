#!/bin/bash

function print_usage {
    printf "usage: %s <IMAGE_URL>\n" $0
}

IMAGE_URL=

while [[ $# -gt 0 ]]; do
    case $1 in
        -i|--image) IMAGE_URL=$2;
            shift 2;
        ;;
        *) printf "\e[31margument not supported:\e[0m %s\n" $1
            shift;
        ;;
    esac;
done;

if [[ -z "${IMAGE_URL}" ]]; then
    print_usage
    exit 2;
fi;

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
