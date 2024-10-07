import re
import uuid
import os
import boto3


class AWSTemporaryUserPool():
    """Provide a temporary user pool for development and testing purposes.

    The provided userpool is empty. If mocking is enabled then changes to
    the userpool will be destroyed when the application exists. If mocking
    is not disabled then destroy() must be called to remove the temporary
    user data from AWS Cognito. It is recommended to use the context manager
    to avoid accidentally persisting development data on AWS.
    """

    def __init__(self, cognito_client):
        self.cognito_client = cognito_client
        self.tmp_userpool_id = None
        self.tmp_client_id = None
        self.tmp_client_secret = None

    def create(self):
        unique_poolname = f"TestUserPool{str(uuid.uuid4())}"
        mock_pool_resp = self.cognito_client.create_user_pool(
            PoolName=unique_poolname, UsernameAttributes=['email'])
        mock_pool_id = mock_pool_resp['UserPool']['Id']

        client_response = self.cognito_client.create_user_pool_client(
            UserPoolId=mock_pool_id,
            ClientName="MockUserPoolClient",
            GenerateSecret=True,
            ExplicitAuthFlows=[
                'ALLOW_USER_PASSWORD_AUTH',  # Enable USER_PASSWORD_AUTH flow
                'ALLOW_REFRESH_TOKEN_AUTH'  # You can add other auth flows as needed
            ])

        self.tmp_userpool_id = mock_pool_id
        self.tmp_client_id = client_response['UserPoolClient']['ClientId']
        self.tmp_client_secret = client_response['UserPoolClient'][
            'ClientSecret']

    def destroy(self):
        self.cognito_client.delete_user_pool_client(
            UserPoolId=self.tmp_userpool_id, ClientId=self.tmp_client_id)
        self.cognito_client.delete_user_pool(UserPoolId=self.tmp_userpool_id)
        self.tmp_userpool_id = None
        self.tmp_client_id = None
        self.tmp_client_secret = None

    def __enter__(self):
        self.create()
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.destroy()
        return self


if __name__ == '__main__':

    cognito_client = boto3.client(
        "cognito-idp",
        region_name="us-east-1",
        aws_access_key_id="testing",
        aws_secret_access_key="testing",
        endpoint_url=os.environ['COGNITO_ENDPOINT_URL'])

    temp_pool = AWSTemporaryUserPool(cognito_client)
    temp_pool.create()

    # Output user pool information that the API can use to connect to moto server
    print("export COGNITO_USER_POOL_ID=" + temp_pool.tmp_userpool_id)
    print("export COGNITO_CLIENT_ID=" + temp_pool.tmp_client_id)
    print("export COGNITO_CLIENT_SECRET=" + temp_pool.tmp_client_secret)
