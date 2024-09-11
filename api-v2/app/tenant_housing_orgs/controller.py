"""Controller (or "Resource") that represents a Housing Org(anization).

This module implements the HTTP interface that represents a Housing Org.
"""
from . import crud, models, schemas

from fastapi import APIRouter, Depends, Request, Response, HTTPException, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.api.deps import (
    get_db, )

router = APIRouter()


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_housing_org(
    housing_org: schemas.HousingOrg,
    request: Request,
    session: Session = Depends(get_db)) -> schemas.HousingOrg:
    """Create a housing org.

    A housing org is created if it is not already in
    the database.

    Return the newly created housing org. Return None
    if the housing org already exists.
    """
    db_org = crud.read_housing_org_by_name(session, housing_org.org_name)
    if db_org:
        return RedirectResponse(status_code=status.HTTP_303_SEE_OTHER,
                                url=f"{request.url}/{db_org.id}")

    return crud.create_housing_org(session, housing_org)


@router.get("/{housing_org_id}")
def get_housing_org(
    housing_org_id: int, session: Session = Depends(get_db)
) -> schemas.HousingOrg | None:
    """Get details about a housing org from an ID.

    :param org_id: The ID of the housing org to read, update or delete
    :type org_id: int
    """
    housing_org = crud.read_housing_org_by_id(session, housing_org_id)
    if not housing_org:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Housing Org not found")
    return housing_org


@router.get("/")
def get_housing_orgs(session: Session = Depends(get_db)) -> list[
        schemas.HousingOrg]:
    """Get a list of all housing orgs."""
    return crud.read_housing_orgs(session)


@router.put("/{housing_org_id}", status_code=status.HTTP_200_OK)
def put_housing_org(
    housing_org_id: int,
    body: schemas.HousingOrg,
    response: Response,
    session: Session = Depends(get_db)) -> schemas.HousingOrg:
    """Create or Update a Housing Org with the given ID.

    Return the updated housing org if update is successful, otherwise return None.

    If the representation contains a Housing Org ID that does match the ID given
    in the path, then a HTTP 409 Conflict will be returned.
    """
    if body.id is not None and body.id != housing_org_id:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Failed to find org with id {housing_org_id}")

    housing_org = models.HousingOrg(id=housing_org_id, org_name=body.org_name)

    was_created = crud.upsert_housing_org(session, housing_org)
    if was_created:
        response.status_code = status.HTTP_201_CREATED

    return housing_org


@router.delete("/{housing_org_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_housing_org(housing_org_id: int,
                       session: Session = Depends(get_db)):
    """Delete a housing org.

    :param housing_org_id: The ID of the housing org to delete.
    """
    housing_org = crud.read_housing_org_by_id(session, housing_org_id)
    if not housing_org:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    crud.delete_housing_org(session, housing_org)
