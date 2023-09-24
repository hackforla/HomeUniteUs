from openapi_server.app import create_app

if __name__ == "__main__":
    connexion_app = create_app()
    flask_app = connexion_app.app
    if flask_app.environment == "production":
        raise EnvironmentError("The production configuration must be run on a "
                               "production server. Connexion's app.run() method "
                               "starts a development server that should be used "
                               "for testing purposes only.")
    connexion_app.run(
        host=flask_app.config["HOST"],
        port=flask_app.config["PORT"],
        load_dotenv=False
    )
