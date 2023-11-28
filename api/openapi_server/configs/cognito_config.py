from dataclasses import dataclass

@dataclass
class AWSCognitoConfig:
    Region: str
    Access_ID: str 
    Access_Key: str

@dataclass 
class AWSCognitoClientConfig:
    UserPoolId: str
    ClientID: str 
    ClientSecret: str