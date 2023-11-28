from contextlib import contextmanager
import uuid

from openapi_server.configs.cognito_config import AWSCognitoClientConfig, AWSCognitoConfig

@contextmanager
def aws_mocking():
    '''
    Provide a context with AWS Cognito mocking enabled.
    All calls to AWS Cognito will be mocked out, and tokens
    will not be authenticated.

    The mocking service will stop when the context exits. The
    mocked AWS Cognito requests will not persist outside of the context.
    
    Yields:
        AWSCognitoConfig: Configuration with mocked AWS credentials.
    '''
    from moto import mock_cognitoidp
    
    mock_aws_service = mock_cognitoidp()
    mock_aws_service.start()
    print("Started AWS Cognito mocking service")

    try:
        yield AWSCognitoConfig(
            "us-east-1", 
            mock_aws_service.FAKE_KEYS['AWS_ACCESS_KEY_ID'], 
            mock_aws_service.FAKE_KEYS['AWS_SECRET_ACCESS_KEY'])
    finally:
        mock_aws_service.stop()
        print("Stopped AWS Cognito mocking service")

@contextmanager
def temporary_aws_userpool(boto_client):
    '''
    Provide a context with a temporary AWS user pool. The
    yielded client_id can be used to modify the provided 
    user pool.

    This user pool can be used with a real or mocked 
    AWS Cognito service. The user pool will be 
    deleted when the context exits.

    Args:
        boto_client: Boto3 client configured for Cognito.

    Yields:
        AWSCognitoClientConfig: The configuration of the created user pool client.
    '''
    unique_poolname = f"TestUserPool{str(uuid.uuid4())}"
    mock_pool_resp = boto_client.create_user_pool(
        PoolName=unique_poolname
    )
    mock_pool_id = mock_pool_resp['UserPool']['Id']

    client_response = boto_client.create_user_pool_client(
        UserPoolId=mock_pool_id,
        ClientName="MockUserPoolClient",
        GenerateSecret=True,
        ExplicitAuthFlows=[
            'ALLOW_USER_PASSWORD_AUTH',  # Enable USER_PASSWORD_AUTH flow
            'ALLOW_REFRESH_TOKEN_AUTH'   # You can add other auth flows as needed
        ]
    )
    client_id = client_response['UserPoolClient']['ClientId']
    client_secret = client_response['UserPoolClient']['ClientSecret'] 
    print("Using a fake temporary userpool")
    try:
        yield AWSCognitoClientConfig(
            UserPoolId=mock_pool_id,
            ClientID=client_id,
            ClientSecret=client_secret
        )
    finally:
        boto_client.delete_user_pool_client(
            UserPoolId=mock_pool_id,
            ClientId=client_id
        )
        boto_client.delete_user_pool(UserPoolId=mock_pool_id)
        print("Destroyed the fake temporary userpool")
