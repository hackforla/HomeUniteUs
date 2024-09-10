import hmac
import base64

from app.core.config import settings


# Helper function to calculate secret hash
def calc_secret_hash(email: str) -> str:
    cognito_client_id = settings.COGNITO_CLIENT_ID
    cognito_client_secret = settings.COGNITO_CLIENT_SECRET

    if cognito_client_id is None:
        print("COGNITO_CLIENT_ID is not set")

    message = email + cognito_client_id
    secret = bytearray(cognito_client_secret, "utf-8")
    dig = hmac.new(
        secret, msg=message.encode("utf-8"), digestmod="sha256"
    ).digest()
    return base64.b64encode(dig).decode()
