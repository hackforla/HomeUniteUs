from openapi_server.app import create_app
from openapi_server.configs.mock_aws import AWSMockService
from openapi_server.configs.registry import HUUConfigRegistry
from openapi_server.repositories.user_repo import UserRepository
from openapi_server.models.database import DataAccessLayer

if __name__ == "__main__":
    connexion_app = create_app()
    flask_app = connexion_app.app

    run_app = lambda: connexion_app.run(
                    host=flask_app.config["HOST"],
                    port=flask_app.config["PORT"],
                    load_dotenv=False
                )
    
    match flask_app.environment:
        case HUUConfigRegistry.DEVELOPMENT:
            # Use mocked AWS Cognito service, and temporary user pool
            with AWSMockService(flask_app) as service:
                with DataAccessLayer.session() as session:
                    user_repo = UserRepository(session)
                    all_emails = [user.email for user in user_repo.get_all_users()]

                for email in all_emails:
                    service.add_aws_userpool_user(email, "Test!123")
                    
                run_app()
        case HUUConfigRegistry.STAGING:
            # Use the real AWS Cognito service, and real user pool
            run_app()
        case HUUConfigRegistry.PRODUCTION:
            print("WARNING: Connexion's app.run() method starts a development "
                  "server that should be used for testing purposes only.")
            # Use the real AWS Cognito service, and real user data
            run_app()
        case _:
            raise EnvironmentError("Unrecognized configuration")