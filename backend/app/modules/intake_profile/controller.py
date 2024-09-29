from typing import Annotated
from fastapi import APIRouter, HTTPException, status, Depends

from app.modules.deps import DbSessionDep, get_form_1, get_form_2

router = APIRouter()


@router.put("/{intake_profile_id}", status_code=status.HTTP_501_NOT_IMPLEMENTED)
def put_intake_profile(body, db_session: DbSessionDep):
    pass
    # TODO: Implement update intake profile responses
    # with db_session.begin() as session:
    #     user_repo = UserRepository(session)
    #     forms_repo = FormsRepository(session)
    #     user = user_repo.get_user(token_info['Username'])

    #     form = forms_repo.get_form(form_id)
    #     if not form:
    #         return f"Form with id {form_id} does not exist.", 404

    #     valid_field_ids = form.get_field_ids()
    #     for response in body:
    #         response["user_id"] = user.id
    #         if response["field_id"] not in valid_field_ids:
    #             return f"Form {form_id} does not contain field id {response['field_id']}", 400

    #     forms_repo.add_user_responses(user.id, body)

    #     return {}, 204


@router.get("/{intake_profile_id}", status_code=status.HTTP_501_NOT_IMPLEMENTED)
def get_intake_profile(intake_profile_id, db_session: DbSessionDep):
    pass
    # TODO: Implement get Intake Profile
    # with db_session.begin() as session:
    #     user_repo = UserRepository(session)
    #     forms_repo = FormsRepository(session)

    #     form = forms_repo.get_form_json(form_id)
    #     if not form:
    #         return f"Form with id {form_id} does not exist.", 404

    #     user = user_repo.get_user(token_info['Username'])
    #     responses = forms_repo.get_user_responses(user.id, form_id)
    #     if responses:
    #         return responses, 200
    #     return [], 202


@router.get("/form/{form_id}", status_code=status.HTTP_200_OK)
def get_intake_profile_form(form_id: int,
                            form_1: Annotated[str, Depends(get_form_1)],
                            form_2: Annotated[str, Depends(get_form_2)]):
    """Get the Intake Profile form definition."""
    if form_id == 1:
        return form_1
    if form_id == 2:
        return form_2

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"Form with id {form_id} does not exist.")
