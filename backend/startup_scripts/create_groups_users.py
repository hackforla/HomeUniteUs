import os
import boto3
import psycopg2


def create_user(cognito_client, user_pool_id, email, group):
    """Create users in moto server cognitoidp."""
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


if __name__ == '__main__':
    cognito_client = boto3.client(
        "cognito-idp",
        region_name="us-east-1",
        aws_access_key_id=os.environ['COGNITO_CLIENT_ID'],
        aws_secret_access_key=os.environ['COGNITO_CLIENT_SECRET'],
        endpoint_url=os.environ['COGNITO_ENDPOINT_URL'])

    user_pool_id = os.environ['COGNITO_USER_POOL_ID']

    cognito_client.create_group(GroupName='Admins', UserPoolId=user_pool_id)
    cognito_client.create_group(GroupName='Hosts', UserPoolId=user_pool_id)
    cognito_client.create_group(GroupName='Guests', UserPoolId=user_pool_id)
    cognito_client.create_group(GroupName='Coordinators',
                                UserPoolId=user_pool_id)

    rows = []
    create_user(cognito_client, user_pool_id, 'admin@email.com', 'Admins')
    print('admin@email.com/Test123! created.')
    rows.append(('admin@email.com', 'admin', 'admin', 1))

    for role, role_id, group in [
        ('guest', 2, 'Guests'),
        ('coordinator', 3, 'Coordinators'),
        ('host', 4, 'Hosts'),
    ]:
        for x in 'abcdefghijklmnopqrstuvwxyz':
            email = role + x + '@email.com'
            rows.append((
                email,
                role,
                x,
                role_id,
            ))
            create_user(cognito_client, user_pool_id, email, group)
            print(email + '/Test123! created.')

    sql = 'INSERT INTO public.user (email, "firstName", "lastName", "roleId") VALUES (%s, %s, %s, %s) ON CONFLICT(email) DO NOTHING'
    with psycopg2.connect(dbname='huu',
                          user="postgres",
                          password="postgres",
                          host="127.0.0.1",
                          port="5432") as db_conn:
        with db_conn.cursor() as cur:
            cur.executemany(sql, rows)
            db_conn.commit()
