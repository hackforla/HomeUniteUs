import os
import boto3
import psycopg2
from urllib.parse import urlparse


def create_user(cognito_client, user_pool_id, email, group):
    """Create users in moto server cognitoidp preventing duplicates."""
    try:
        cognito_client.admin_get_user(UserPoolId=user_pool_id, Username=email)
    except Exception:
        # The exception means the user doesn't exist so it can now be created.
        cognito_client.admin_create_user(UserPoolId=user_pool_id,
                                         Username=email,
                                         TemporaryPassword="Test123!",
                                         MessageAction='SUPPRESS')

        cognito_client.admin_confirm_sign_up(UserPoolId=user_pool_id,
                                             Username=email)

        cognito_client.admin_add_user_to_group(
            UserPoolId=user_pool_id,
            Username=email,
            GroupName=group,
        )


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
    create_user(cognito_client, user_pool_id, 'admin@example.com', 'Admins')
    print('admin@example.com/Test123! created.')
    rows.append(('admin@example.com', 'admin', 'admin', 1))

    for role, role_id, group in [
        ('guest', 2, 'Guests'),
        ('coordinator', 3, 'Coordinators'),
        ('host', 4, 'Hosts'),
    ]:
        for x in 'abcdefghijklmnopqrstuvwxyz':
            email = role + x + '@example.com'
            rows.append((
                email,
                role,
                x,
                role_id,
            ))
            create_user(cognito_client, user_pool_id, email, group)
            print(email + '/Test123! created.')

    sql = 'INSERT INTO public.user (email, "firstName", "lastName", "roleId") VALUES (%s, %s, %s, %s) ON CONFLICT(email) DO NOTHING'
    url = urlparse(os.environ['DATABASE_URL'])
    with psycopg2.connect(database=url.path[1:],
                          user=url.username,
                          password=url.password,
                          host=url.hostname,
                          port=url.port) as db_conn:
        with db_conn.cursor() as cur:
            cur.executemany(sql, rows)
            db_conn.commit()
