import re
import uuid
import os
import boto3


class AWSTemporaryUserPool():
    """Provide a temporary user pool for development and testing purposes."""

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


if __name__ == '__main__':

    cognito_client = boto3.client(
        "cognito-idp",
        region_name="us-east-1",
        aws_access_key_id="testing",
        aws_secret_access_key="testing",
        endpoint_url=os.environ['COGNITO_ENDPOINT_URL'])

    # Only create a user pool and test data if one does not already exist
    pools = cognito_client.list_user_pools(MaxResults=5)
    if len(pools['UserPools']) > 0:
        # It is assumed that if the user pool exists then it has test data for use already.
        USER_POOL_ID = pools['UserPools'][0]['Id']

        clients = cognito_client.list_user_pool_clients(
            UserPoolId=USER_POOL_ID, MaxResults=5)

        CLIENT_ID = clients['UserPoolClients'][0]['ClientId']

        user_pool_client = cognito_client.describe_user_pool_client(
            UserPoolId=USER_POOL_ID, ClientId=CLIENT_ID)
        CLIENT_SECRET = user_pool_client['UserPoolClient']['ClientSecret']
    else:
        temp_pool = AWSTemporaryUserPool(cognito_client)
        temp_pool.create()

        USER_POOL_ID = temp_pool.tmp_userpool_id
        CLIENT_ID = temp_pool.tmp_client_id
        CLIENT_SECRET = temp_pool.tmp_client_secret

    # Output user pool information that the API can use to connect to moto server
    print("export COGNITO_USER_POOL_ID=" + USER_POOL_ID)
    print("export COGNITO_CLIENT_ID=" + CLIENT_ID)
    print("export COGNITO_CLIENT_SECRET=" + CLIENT_SECRET)
