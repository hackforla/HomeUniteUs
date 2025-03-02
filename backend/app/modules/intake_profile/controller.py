from typing import Annotated
from fastapi import APIRouter, HTTPException, status, Depends

from app.modules.deps import DbSessionDep, get_form_1, get_form_2

router = APIRouter()


# @router.put("/responses/{user_id}", status_code=status.HTTP_501_NOT_IMPLEMENTED)
# def update_intake_profile_responses(user_id, body, db_session: DbSessionDep):
#     pass
    # TODO: Implement the functionality to update intake profile responses.
    # This should:
    # 1. Use the `db_session` to initiate a transaction.
    # 2. Retrieve the user data using the `user_id`.
    # 3. Get the specific form by `form_id`.
    # 4. Check if the form exists. If not, return an error (404).
    # 5. Validate the field IDs in the response body against the form's field IDs.
    # 6. If any field ID is invalid, return an error (400).
    # 7. Save the valid responses in the database.
    # 8. Return a success response with status 204 (no content) if everything goes well.

# @router.get("/responses/{user_id}", status_code=status.HTTP_501_NOT_IMPLEMENTED)
# def get_intake_profile_responses(user_id, db_session: DbSessionDep):
#     pass
    # TODO: Implement the functionality to retrieve intake profile responses for a user.
    # This should:
    # 1. Use the `db_session` to begin a transaction.
    # 2. Retrieve the user using the `user_id`.
    # 3. Fetch the form associated with the user's responses.
    # 4. If the form does not exist, return a 404 error.
    # 5. Get the user responses for the form from the database.
    # 6. If responses are found, return them with status 200.
    # 7. If no responses are found, return an empty list with status 202.

# @router.get("/responses/{profile_type}", status_code=status.HTTP_200_OK)
# def get_intake_profile_form(profile_type: str,
#                             profile_form_1: Annotated[dict, Depends(get_form_1)],
#                             profile_form_2: Annotated[dict, Depends(get_form_2)]):
#     """Get the Intake Profile form definition for host or guest."""
#     if profile_type == "guest":
#         return profile_form_1
#     if profile_type == "host":
#         return profile_form_2
    # TODO: Return the appropriate form based on the `profile_type` (either "guest" or "host").
    # 1. Use `profile_form_1` for the "guest" type and return it.
    # 2. Use `profile_form_2` for the "host" type and return it.
    # 3. If the `profile_type` is not recognized, raise a 404 error.

# @router.get("/form/{profile_id}", status_code=status.HTTP_200_OK)
# def get_intake_profile_form(profile_id: int,
#                             profile_form_1: Annotated[str, Depends(get_form_1)],
#                             profile_form_2: Annotated[str, Depends(get_form_2)]):
#     """Get the Intake Profile form definition."""
#     if profile_id == 1:
#         return profile_form_1
#     if profile_id == 2:
#         return profile_form_2
    # TODO: Return the form based on the `profile_id`.
    # 1. If the `profile_id` is 1, return `profile_form_1`.
    # 2. If the `profile_id` is 2, return `profile_form_2`.
    # 3. If the `profile_id` is not valid, raise a 404 error.

# This is your current working function:
@router.get("/form/{profile_type}", status_code=status.HTTP_200_OK)
def get_intake_profile_form(profile_type: str,
                            profile_form_1: Annotated[dict, Depends(get_form_1)],
                            profile_form_2: Annotated[dict, Depends(get_form_2)]):
    """Get the Intake Profile form definition and responses for host or guest."""
    if profile_type == "guest":
        return {
            "form": profile_form_1,
            "responses": profile_form_1.get("responses", [])
        }
    if profile_type == "host":
        return {
            "form": profile_form_2,
            "responses": profile_form_2.get("responses", [])
        }

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"Form type {profile_type} does not exist.")
