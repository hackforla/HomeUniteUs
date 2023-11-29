from openapi_server.app import create_app
from openapi_server.configs.mock_aws import aws_mocking, temporary_aws_userpool

if __name__ == "__main__":
    connexion_app = create_app()
    flask_app = connexion_app.app

    run_app = lambda: connexion_app.run(
                    host=flask_app.config["HOST"],
                    port=flask_app.config["PORT"],
                    load_dotenv=False
                )

    if flask_app.environment == "development":
        # Mock AWS Cognito and provide a temporary userpool
        with aws_mocking() as mock_config:
            flask_app.configure_botoclient(mock_config)
            with temporary_aws_userpool(flask_app.boto_client) as client_config:
                flask_app.configure_userpool(client_config)
                run_app()
    elif (flask_app.environment == "staging") and flask_app.is_test_app:
        # Use the real AWS Cognito service, but a temporary user pool
        with temporary_aws_userpool(flask_app.boto_client) as client_config:
            flask_app.configure_userpool(client_config)
            run_app()
    elif flask_app.environment == "staging":
        # Use the real AWS Cognito service, and real user data
        run_app()
    elif flask_app.environment == "production":
        raise EnvironmentError("The production configuration must be run on a "
                               "production server. Connexion's app.run() method "
                               "starts a development server that should be used "
                               "for testing purposes only.")
    else:
        raise EnvironmentError("Unrecognized configuration")