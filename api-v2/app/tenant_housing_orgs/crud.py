"""A simple CRUD implementation for the HousingOrg data model."""

from sqlalchemy.orm import Session
from sqlalchemy import select

from . import models


def create_housing_org(session: Session, new_housing_org: models.HousingOrg):
    """Create a Housing Org."""
    session.add(new_housing_org)


def read_housing_org_by_id(session: Session,
                           housing_org_id: int) -> models.HousingOrg:
    """Read a HousingOrg by ID."""
    return session.get(models.HousingOrg, housing_org_id)


def read_housing_org_by_name(session: Session,
                             org_name: str) -> models.HousingOrg:
    """Read a HousingOrg by name."""
    query = select(
        models.HousingOrg).filter(models.HousingOrg.org_name == org_name)
    return session.scalars(query).one_or_none()


def read_housing_orgs(session: Session) -> list[models.HousingOrg]:
    """Read all HousingOrgs returned as a list."""
    return session.scalars(select(models.HousingOrg)).all()


def upsert_housing_org(session: Session,
                       housing_org: models.HousingOrg) -> bool:
    """Upsert (Update or Insert) a HousingOrg.

    If a HousingOrg exists, it will be updated and the function
    will return False.

    If a HousingOrg does not exist, it will be added to the database
    and the function will return True.
    """
    was_created = False

    db_housing_org = session.query(
        models.HousingOrg).filter_by(id=housing_org.id).first()
    if db_housing_org:
        db_housing_org.org_name = housing_org.org_name
    else:
        session.add(housing_org)
        was_created = True

    return was_created


def delete_housing_org(session: Session, housing_org: models.HousingOrg):
    """Delete a HousingOrg."""
    housing_org = session.get(models.HousingOrg, housing_org.id)
    session.delete(housing_org)
