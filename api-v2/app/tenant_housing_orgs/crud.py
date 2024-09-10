from sqlalchemy.orm import Session
from sqlalchemy import select, insert, update

from . import models, schemas


def create_housing_org(session: Session, housing_org: schemas.HousingOrg):
    new_org = models.HousingOrg(org_name=housing_org.org_name)
    session.add(new_org)
    session.commit()
    session.refresh(new_org)
    return new_org


def read_housing_org_by_id(session: Session,
                           housing_org_id: int) -> models.HousingOrg:
    return session.get(models.HousingOrg, housing_org_id)


def read_housing_org_by_name(session: Session,
                             org_name: str) -> models.HousingOrg:
    query = select(
        models.HousingOrg).filter(models.HousingOrg.org_name == org_name)
    return session.scalars(query).one_or_none()


def read_housing_orgs(session: Session) -> list[models.HousingOrg]:
    return session.scalars(select(models.HousingOrg)).all()


def upsert_housing_org(session: Session,
                       housing_org: models.HousingOrg) -> bool:
    was_created = False

    with session.begin():
        db_housing_org = session.query(models.HousingOrg).filter_by(id=housing_org.id).first()
        if db_housing_org:
            db_housing_org.org_name = housing_org.org_name
        else:
            session.add(housing_org)
            was_created = True
        session.commit()

    return was_created

def delete_housing_org(session: Session, housing_org: models.HousingOrg):
    housing_org = session.get(models.HousingOrg, housing_org.id)
    session.delete(housing_org)
    session.commit()
