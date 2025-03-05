# Architecture Diagrams

### Infrastructure

```mermaid
architecture-beta
    group incubator(cloud)[Incubator AWS]
    group browser(internet)[Browser]

    service db(database)[PostgreSQL DB] in incubator
    service s3(disk)[S3] in incubator
    service api(server)[ECS] in incubator
    service app(server)[UI] in browser

    junction junctionCenter

    app:R --> L:api
    api:R --> L:junctionCenter
    junctionCenter:T --> B:db
    junctionCenter:B --> T:s3

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