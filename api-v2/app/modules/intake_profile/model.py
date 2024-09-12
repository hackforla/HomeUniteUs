
from enum import Enum, auto


class IntakeProfileStatus(Enum):
    NEW = auto()
    IN_PROGRESS = auto()
    APPROVED = auto()
    DENIED = auto()


class IntakeProfile:

    def __init__(self, form_id: int):
        if form_id is None:
            raise Exception("IntakeProfile is not valid without a Form")
        self.intake_form_id: form_id = form_id
        self.attachments: list[bytes] = []
        self.status: IntakeProfileStatus = IntakeProfileStatus.NEW


