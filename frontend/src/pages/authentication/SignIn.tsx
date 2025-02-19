import React, {useEffect} from 'react';
import {useNavigate, Location} from 'react-router-dom';
import {
  Typography,
  Stack,
  Link,
  Divider,
  Alert,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import {setCredentials} from '../../redux/authSlice';
import {useAppDispatch} from '../../redux/hooks/store';
import {isFetchBaseQueryError, isErrorWithMessage} from '../../redux/helpers';
import {
  SignInRequest,
  useGoogleSignInMutation,
  useSignInMutation,
} from '../../services/auth';
import {SignInForm, FormContainer} from '../../features/authentication';
import {
  useAuthenticateWithOAuth,
  redirectsByRole,
} from '../../features/authentication/hooks/useAuthenticateWithOAuth';

export interface LocationState {
  from: Location;
}

interface ErrorDisplayState {
  message: string;
}

interface AuthErrorResponse {
  detail: {
    message: string;
  };
}

const isAuthError = (error: unknown): error is AuthErrorResponse => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'detail' in error &&
    typeof error.detail === 'object' &&
    error.detail !== null &&
    'message' in error.detail
  );
};

export const SignIn = () => {
  const [oAuthError, setOAuthError] = React.useState('');
  const [errorState, setErrorState] = React.useState<ErrorDisplayState>({
    message: '',
  });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [signIn, {isLoading: signInIsLoading}] = useSignInMutation();
  const [googleSignIn, {isLoading: getTokenIsLoading}] =
    useGoogleSignInMutation();

  useAuthenticateWithOAuth({
    query: googleSignIn,
    setErrorMessage: setOAuthError,
    callbackUri: '/signin',
  });

  useEffect(() => {
    if (oAuthError) {
      setErrorState({message: oAuthError});
    }
  }, [oAuthError]);

  const clearError = () => {
    setErrorState({message: ''});
  };

  const handleSignIn = async ({email, password}: SignInRequest) => {
    try {
      const response = await signIn({
        email,
        password,
      }).unwrap();

      const {user, token} = response;
      dispatch(setCredentials({user, token}));
      navigate(redirectsByRole[user.role.type]);
    } catch (err) {
      if (isFetchBaseQueryError(err) && isAuthError(err.data)) {
        setErrorState({
          message: err.data.detail.message,
        });
      } else if (isErrorWithMessage(err)) {
        setErrorState({
          message: 'Unable to connect. Please check your internet connection.',
        });
      }
    }
  };

  return (
    <FormContainer>
      <Stack
        py={2}
        spacing={4}
        sx={{justifyContent: 'center', alignItems: 'center', width: '100%'}}
      >
        {errorState.message && (
          <Alert
            sx={{width: '100%'}}
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={clearError}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            <Typography>{errorState.message}</Typography>
          </Alert>
        )}
        <Typography variant="h4" fontWeight="600">
          Sign in
        </Typography>
        <SignInForm
          onSubmit={handleSignIn}
          isLoading={signInIsLoading || getTokenIsLoading}
        />
        <Divider sx={{width: '100%'}} />
        <Stack direction="row" alignItems="center" gap={0.5}>
          <Typography variant="body2">New user?</Typography>
          <Link underline="always" href="/signup">
            Create an account
          </Link>
        </Stack>
      </Stack>
    </FormContainer>
  );
};
