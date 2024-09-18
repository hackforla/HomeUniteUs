class SignUpUserError(Exception):

    def __init__(self, error):
        self.error = error


class SignInError(Exception):

    def __init__(self, code, message):
        self.code = code
        self.message = message


class SessionError(Exception):

    def __init__(self, code, message):
        self.code = code
        self.message = message


class RefreshError(Exception):

    def __init__(self, code, message):
        self.code = code
        self.message = message

class ForgotPasswordError(Exception):

    def __init__(self, code, message):
        self.code = code
        self.message = message

class ConfirmForgotPasswordError(Exception):

    def __init__(self, code, message):
        self.code = code
        self.message = message
