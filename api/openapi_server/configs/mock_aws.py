import re
import uuid

class AWSTemporaryUserpool():
    '''
    Provide a temporary user pool for development and testing purposes.

    The provided userpool is empty. If mocking is enabled then changes to
    the userpool will be destroyed when the application exists. If mocking
    is not disabled then destroy() must be called to remove the temporary
    user data from AWS Cognito. It is recommended to use the context manager
    to avoid accidentally persisting development data on AWS.
    '''

    def __init__(self, flask_app):
        self.app = flask_app
        self.tmp_userpool_id = None 
        self.tmp_client_id = None

    @staticmethod
    def is_temp_pool(poolname: str) -> bool:
        '''
        Return True if the AWS cognito poolname 
        matches the format of a temporary userpool.
        '''
        regex = re.compile(f"^TestUserPool[0-9a-fA-F]{{8}}-[0-9a-fA-F]{{4}}-[0-9a-fA-F]{{4}}-[0-9a-fA-F]{{4}}-[0-9a-fA-F]{{12}}$")
        return bool(re.match(regex, poolname))

    def create(self):
        unique_poolname = f"TestUserPool{str(uuid.uuid4())}"
        mock_pool_resp = self.app.boto_client.create_user_pool(
            PoolName=unique_poolname
        )
        mock_pool_id = mock_pool_resp['UserPool']['Id']

        client_response = self.app.boto_client.create_user_pool_client(
            UserPoolId=mock_pool_id,
            ClientName="MockUserPoolClient",
            GenerateSecret=True,
            ExplicitAuthFlows=[
                'ALLOW_USER_PASSWORD_AUTH',  # Enable USER_PASSWORD_AUTH flow
                'ALLOW_REFRESH_TOKEN_AUTH'   # You can add other auth flows as needed
            ]
        )

        self.tmp_userpool_id = mock_pool_id 
        self.tmp_client_id = client_response['UserPoolClient']['ClientId']
        self.app.config["COGNITO_USER_POOL_ID"] = self.tmp_userpool_id
        self.app.config["COGNITO_CLIENT_ID"]  = self.tmp_client_id
        self.app.config["COGNITO_CLIENT_SECRET"] = client_response['UserPoolClient']['ClientSecret'] 
        print("Created fake temporary userpool")

    def destroy(self):
        self.app.boto_client.delete_user_pool_client(
            UserPoolId=self.tmp_userpool_id,
            ClientId=self.tmp_client_id
        )
        self.app.boto_client.delete_user_pool(
            UserPoolId=self.tmp_userpool_id
        )
        self.tmp_userpool_id = None 
        self.tmp_client_id = None
        print("Destroyed fake temporary userpool")

    def __enter__(self):
        self.create() 

    def __exit__(self, exc_type, exc_value, traceback):
        self.destroy()

class AWSMockService():
    '''
    Start and stop AWS Cognito mocking using moto.

    The mocking service will stop when the context exits. The
    mocked AWS Cognito requests will not persist outside of the context.
    '''

    def __init__(self, flask_app):
        from moto import mock_cognitoidp
        self.userpool = AWSTemporaryUserpool(flask_app)
        self.mock_service = mock_cognitoidp()
        self.app = flask_app

    def start(self):
        self.mock_service.start()
        self.app._boto_client = None
        self.app.config["COGNITO_REGION"] = "us-east-1"
        self.app.config["COGNITO_ACCESS_ID"] = self.mock_service.FAKE_KEYS['AWS_ACCESS_KEY_ID']
        self.app.config["COGNITO_ACCESS_KEY"] = self.mock_service.FAKE_KEYS['AWS_SECRET_ACCESS_KEY']
        self.userpool.create()

        print("Started mock AWS Cognito service")

    def stop(self):
        self.userpool.destroy()
        self.mock_service.stop()
        self.app.config["COGNITO_REGION"] = None
        self.app.config["COGNITO_ACCESS_ID"] = None
        self.app.config["COGNITO_ACCESS_KEY"] = None
        self.app._boto_client = None
        
        print("Stopped mock AWS Cognito service")

    def __enter__(self):
        self.start() 

    def __exit__(self, exc_type, exc_value, traceback):
        self.stop()