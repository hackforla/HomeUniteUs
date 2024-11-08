import os
import boto3
import psycopg2
from urllib.parse import urlparse


def create_user(cognito_client, user_pool_id, email, group):
    """Create users in moto server cognitoidp preventing duplicates."""
    try:
        response = cognito_client.admin_get_user(UserPoolId=user_pool_id, Username=email)
        sub = [s['Value'] for s in response['UserAttributes'] if s['Name'] == 'sub']
        if len(sub) == 0:
            raise Exception('No sub found.')
        return sub[0]
    except Exception:
        # The exception means the user doesn't exist so it can now be created.
        response = cognito_client.admin_create_user(
            UserPoolId=user_pool_id,
            Username=email,
            TemporaryPassword="Test123!",
            MessageAction='SUPPRESS')

        sub = [s['Value'] for s in response['User']['Attributes'] if s['Name'] == 'sub']
        if len(sub) == 0:
            raise Exception('No sub found.')

        cognito_client.admin_confirm_sign_up(UserPoolId=user_pool_id,
                                             Username=email)

        cognito_client.admin_add_user_to_group(
            UserPoolId=user_pool_id,
            Username=email,
            GroupName=group,
        )

        return sub[0]


def create_group(groups, group, user_pool_id):
    """Create a group in moto server preventing duplicates."""
    if not any(g['GroupName'] == group for g in groups['Groups']):
        cognito_client.create_group(GroupName=group, UserPoolId=user_pool_id)


if __name__ == '__main__':
    cognito_client = boto3.client(
        "cognito-idp",
        region_name="us-east-1",
        aws_access_key_id=os.environ['COGNITO_CLIENT_ID'],
        aws_secret_access_key=os.environ['COGNITO_CLIENT_SECRET'],
        endpoint_url=os.environ['COGNITO_ENDPOINT_URL'])

    user_pool_id = os.environ['COGNITO_USER_POOL_ID']

    # Get existing groups to prevent duplicates
    groups = cognito_client.list_groups(
        UserPoolId=user_pool_id,
        Limit=10,
    )
    create_group(groups, 'Admins', user_pool_id)
    create_group(groups, 'Hosts', user_pool_id)
    create_group(groups, 'Guests', user_pool_id)
    create_group(groups, 'Coordinators', user_pool_id)

    rows = []
    user_id = create_user(cognito_client, user_pool_id, 'admin@example.com', 'Admins')
    print(f'{user_id}/admin@example.com/Test123! created.')
    rows.append(
        (user_id, 'admin@example.com', 'admin', 'admin', 'admin'))

    for role, group in [
        ('guest', 'Guests'),
        ('coordinator', 'Coordinators'),
        ('host', 'Hosts'),
    ]:
        for x in 'abcdefghijklmnopqrstuvwxyz':
            email = role + x + '@example.com'
            user_id = create_user(cognito_client, user_pool_id, email, group)
            rows.append((
                user_id,
                email,
                role,
                x,
                role,
            ))
            print(f'{user_id}/{email}/Test123! created.')

    sql = 'INSERT INTO public.users (user_id, email, first_name, last_name, role) VALUES (%s, %s, %s, %s, %s) ON CONFLICT(email) DO UPDATE SET user_id = EXCLUDED.user_id'
    url = urlparse(os.environ['DATABASE_URL'])
    with psycopg2.connect(database=url.path[1:],
                          user=url.username,
                          password=url.password,
                          host=url.hostname,
                          port=url.port) as db_conn:
        with db_conn.cursor() as cur:
            cur.executemany(sql, rows)
            db_conn.commit()
