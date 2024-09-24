
from fastapi import Depends, APIRouter, HTTPException, Response, Security
# from fastapi.responses import RedirectResponse

# from app.modules.deps import (
#     DbSessionDep,
#     CognitoIdpDep,
# )

router = APIRouter()


# @router.post("/guest/")
# def post_guest_intake_profile(body, guest: Depends(aim_guest)):
#     forms_repo = FormsRepository(DataAccessLayer.session())

#     form_id = forms_repo.add_form(body)
#     form = forms_repo.get_form_json(form_id)
#     if form:
#         return form, 200
#     return {}, 404


# @router.get("/guest/{form_id}")
# def get_guest_intake_profile(form_id, guest: Depends(aim_guest)):
#     forms_repo = FormsRepository(DataAccessLayer.session())

#     form = forms_repo.get_form_json(form_id)
#     if form:
#         return form, 200
#     return f"Form with id {form_id} does not exist.", 404
