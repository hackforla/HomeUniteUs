from .models import UnmatchedGuestCase, UnmatchedGuestCaseStatus

from enum import Enum

class UmatchedCaseStatus(Enum):
    IN_PROGRESS = "In Progress"
    COMPLETE = "Complete"


class UnmatchedCaseRepository:

    def __init__(self, session):
        self.session = session

    def add_case(self, guest_id: int,
                 coordinator_id: int) -> UnmatchedGuestCase:
        status_id = self.session.query(UnmatchedGuestCaseStatus).filter_by(
            status_text=UmatchedCaseStatus.IN_PROGRESS).first().id
        new_guest_case = UnmatchedGuestCase(guest_id=guest_id,
                                            coordinator_id=coordinator_id,
                                            status_id=status_id)
        self.session.add(new_guest_case)
        self.session.commit()

        return new_guest_case

    def delete_case_for_guest(self, guest_id: int) -> bool:
        guest_case = self.session.query(UnmatchedGuestCaseStatus).filter_by(
            guest_id=guest_id).first()
        if guest_case:
            self.session.delete(guest_case)
            self.session.commit()
            return True
        return False

    def get_case_for_guest(self, guest_id: int) -> UnmatchedGuestCase:
        return self.session.query(UnmatchedGuestCase).filter_by(
            guest_id=guest_id).first()
