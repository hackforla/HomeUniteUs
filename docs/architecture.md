# Architecture Diagrams

### Infrastructure

```mermaid
architecture-beta
    group incubator(cloud)[Incubator AWS Account]
    group browser(internet)[Browser]

    service db(database)[PostgreSQL DB] in incubator
    service s3(disk)[S3] in incubator
    service cognito(server)[Cognito User Pool] in incubator
    service secrets(server)[Secrets Manager] in incubator
    service api(server)[Server API ECS Container] in incubator
    service app(server)[Client UI React App] in browser

    junction junctionCenter
    junction junctionRight

    app:R --> L:api
    api:R -- L:junctionCenter
    junctionCenter:R -- L:junctionRight
    junctionCenter:T --> B:db
    junctionCenter:B --> T:s3
    junctionRight:T --> B:cognito
    junctionRight:B --> T:secrets

```
<!-- ```mermaid
architecture-beta
    group backend(cloud)[Incubator]
    group postgres(database)[RDS] (in backend)
    group cognito(server)[Cognito] (in backend)
    group ecs(server)[ECS] (in backend)
    group frontend(server)[Browser]

    service api(server)[FastAPI Server] in ecs
    service app(server)[React App] in frontend
    
    api:T -- B:postgres
    api:L -- R:cognito

    app:T --> B:api

``` -->