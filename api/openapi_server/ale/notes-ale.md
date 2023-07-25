## GET Application Steps Info
Get a list of tasks to complete application.

'/application_management/guests/{guest_id}/applications/{application_id}/tasks'

Input:
- Guest_id
- Application_id
```SQL
SELECT 
    id AS application_id, 
    guest_id, 
    application_tasks, 
    onboarding_tasks, 
    host_selection_tasks, 
    match_finalize_tasks
FROM huu.guest_applications
WHERE guest_id = {id}
;
```
Output:
- Steps with their tasks
```json
{
    "guest_id": 4587,
    "application_id": 789,
    "tasks": [
        {
            "Application": "Application Complete"
        },
        {
            "Onboarding": "Onboarding Complete"
        },
        {
            "Host Selection": "Host Selection Compelete"
        },
        {
            "Match Finalized": "Match Finalizing In Progress"
        }
    ]
}

```

## Design File
https://www.figma.com/file/BNWqZk8SHKbtN1nw8BB7VM/HUU-Everything-Figma-Nov-2022?type=design&node-id=8154-110885&mode=design&t=YHkDnA9Ao3YSriGo-0

## Todo:
- [ ] Add new entities to openapi/schema/_index.yaml
    - ongoing

- [ ] Try to create new entities in database by running 'Making changes to openapi spec' or ''Alembic migration" in github readme, https://github.com/hackforla/HomeUniteUs/tree/main/api#alembic-migrations
    - ongoing

- [ ] Try to fix the broken api. Start the app via docker compose up api ?
    - [Jules fixed](https://github.com/hackforla/HomeUniteUs/pull/537) 

- [ ] Practice creating and adding to Postgres table.
    - see sql and json attached

- [ ] Look at normalization from [interviewBit](https://www.interviewbit.com/sql-interview-questions/#what-is-normalization)
    - reviewed (i.e. break up tables into as small components as possible)


## activate .venv
in WSL in the api directory 
$ . .venv/bin/activate