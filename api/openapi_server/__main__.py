from openapi_server.app import create_app
from openapi_server.configs.mock_aws import AWSMockService, AWSTemporaryUserpool
from openapi_server.configs.registry import HUUConfigRegistry

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
            with AWSMockService(flask_app):
                run_app()
        case HUUConfigRegistry.STAGING:
            if flask_app.is_test_app:
                # Use the real AWS Cognito service, but a temporary user pool
                with AWSTemporaryUserpool(flask_app):
                    run_app()
            else:
                # Use the real AWS Cognito service, and real user data
                run_app()
        case HUUConfigRegistry.PRODUCTION:
            raise EnvironmentError("The production configuration must be run on a "
                               "production server. Connexion's app.run() method "
                               "starts a development server that should be used "
                               "for testing purposes only.")
        case _:
            raise EnvironmentError("Unrecognized configuration")