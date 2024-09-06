from flask import Response

from openapi_server.models.database import DataAccessLayer
from openapi_server.models.schema import users_schema
from openapi_server.models.user_roles import UserRole
from openapi_server.repositories.user_repo import UserRepository, UnmatchedCaseRepository

import json
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
def get_dashboard_data() -> Response:
    with DataAccessLayer.session() as session:
        user_repo = UserRepository(session)
        coordinator_users_by_id = {x.id: x for x in user_repo.get_users_with_role(UserRole.COORDINATOR)}
        print(f'get_dashboard_data(): coordinator_users_by_id = {json.dumps({k:v.email for k,v in coordinator_users_by_id.items()})}')
        case_repo = UnmatchedCaseRepository(session)
        
        all_users = []
        for guest in user_repo.get_users_with_role(UserRole.GUEST):
            print(f'get_dashboard_data(): looking at guest: {guest.email} with ID "{guest.id}"')
            case_status = case_repo.get_case_for_guest(int(guest.id))
            print(f'get_dashboard_data(): get_case_for_guest({guest.id}) returned "{case_status}"')
            coordinator = coordinator_users_by_id[case_status.coordinator_id]
            all_users.append({
                'id': guest.id,
                'userName': f'{guest.firstName} {guest.lastName}',
                'caseStatus': 'In Progress',
                'userType':'GUEST',
                'coordinatorName': f'{coordinator.firstName} {coordinator.lastName}',
                'lastUpdated': '2024-08-25',
                'Notes': 'N/A'
            })

        for host in user_repo.get_users_with_role(UserRole.HOST):
            all_users.append({
                'id': host.id,
                'userName': f'{host.firstName} {host.lastName}',
                'caseStatus': 'In Progress',
                'userType':'HOST',
                'coordinatorName': f'N/A',
                'lastUpdated': '2024-08-25',
                'Notes': 'N/A'
            })

        for coordinator in user_repo.get_users_with_role(UserRole.COORDINATOR):
            all_users.append({
                'id': coordinator.id,
                'userName': f'{coordinator.firstName} {coordinator.lastName}',
                'caseStatus': 'N/A',
                'userType':'COORDINATOR',
                'coordinatorName': f'N/A',
                'lastUpdated': '2024-08-25',
                'Notes': 'N/A'
            })

        return {
            'dashboardItems': all_users
        }, 200
