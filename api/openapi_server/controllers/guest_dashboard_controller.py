# Third Party
import connexion

guest_application_repository = GuestApplicationRepository()

def get_guest_application_steps(guest_id: int, application_id: int):

    if not connexion.request.is_json:
        return "Bad Request", 400
    
    # TODO: add parameters validation

    steps = guest_application_repository.get_application_steps(guest_id, application_id)

    if not steps:
        return "Application steps not found.", 404

    return steps, 200