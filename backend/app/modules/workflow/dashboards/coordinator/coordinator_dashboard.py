from fastapi import APIRouter, status
from fastapi.responses import JSONResponse

from ...unmatched_guest_case import UnmatchedCaseRepository
from app.modules.access.user_repo import UserRepository
from app.modules.access.user_roles import UserRole
from app.modules.deps import DbSessionDep

router = APIRouter()


@router.get("/coordinator/dashboard/all", status_code=status.HTTP_200_OK)
def get_dashboard_data(db_session: DbSessionDep) -> JSONResponse:
    """

            userName:
            type: string
            caseStatus:
            type: string
            coordinatorName:
            type: string
            userType:
            type: string
            lastUpdated:
            type: string
            notes:
            type: string
    """
    with db_session.begin():
        user_repo = UserRepository(db_session)
        coordinator_users_by_id = {
            x.id: x
            for x in user_repo.get_users_with_role(UserRole.COORDINATOR)
        }
        case_repo = UnmatchedCaseRepository(db_session)

        all_users = []
        for guest in user_repo.get_users_with_role(UserRole.GUEST):
            case_status = case_repo.get_case_for_guest(int(guest.id))
            coordinator = coordinator_users_by_id[case_status.coordinator_id]
            all_users.append({
                'id': guest.id,
                'userName': f'{guest.firstName} {guest.lastName}',
                'caseStatus': 'In Progress',
                'userType': 'GUEST',
                'coordinatorName':
                f'{coordinator.firstName} {coordinator.lastName}',
                'lastUpdated': '2024-08-25',
                'Notes': 'N/A'
            })

        for host in user_repo.get_users_with_role(UserRole.HOST):
            all_users.append({
                'id': host.id,
                'userName': f'{host.firstName} {host.lastName}',
                'caseStatus': 'In Progress',
                'userType': 'HOST',
                'coordinatorName': f'N/A',
                'lastUpdated': '2024-08-25',
                'Notes': 'N/A'
            })

        for coordinator in user_repo.get_users_with_role(UserRole.COORDINATOR):
            all_users.append({
                'id': coordinator.id,
                'userName': f'{coordinator.firstName} {coordinator.lastName}',
                'caseStatus': 'N/A',
                'userType': 'COORDINATOR',
                'coordinatorName': f'N/A',
                'lastUpdated': '2024-08-25',
                'Notes': 'N/A'
            })

        return JSONResponse(content={'dashboardItems': all_users})
