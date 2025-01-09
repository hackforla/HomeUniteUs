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
  helperText?: string;
  fieldErrors?: {
    email?: string;
    password?: string;
  };
}

export const SignIn = () => {
  const [oAuthError, setOAuthError] = React.useState('');
  const [errorState, setErrorState] = React.useState<ErrorDisplayState>({
    message: '',
    helperText: undefined,
    fieldErrors: undefined,
  });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [signIn, {isLoading: signInIsLoading}] = useSignInMutation();
  const [googleSignIn, {isLoading: getTokenIsLoading}] =
    useGoogleSignInMutation();
  // const locationState = location.state as LocationState;

  // Save location from which user was redirected to login page
  // const from = locationState?.from?.pathname || '/';
  useAuthenticateWithOAuth({
    query: googleSignIn,
    setErrorMessage: setOAuthError,
    callbackUri: '/signin',
  });

  useEffect(() => {
    if (oAuthError) {
      setErrorState({
        message: oAuthError,
        fieldErrors: undefined,
      });
    }
  }, [oAuthError]);

  const clearError = () => {
    setErrorState({
      message: '',
      fieldErrors: undefined,
      helperText: undefined,
    });
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
      if (isFetchBaseQueryError(err)) {
        // TODO: remove this information after debugging is complete. error codes should only be on server
        console.error('Sign in error:', {
          code: err.data?.code,
          error: err,
        });

        switch (err.data?.code) {
          case 'AUTH001':
          case 'AUTH002':
            setErrorState({
              message: 'Invalid email or password',
              fieldErrors: {
                email: 'Please check your credentials',
                password: 'Please check your credentials',
              },
            });
            break;

          case 'AUTH003':
            setErrorState({
              message: 'Please verify your email',
              fieldErrors: {
                email: 'Check your inbox for a verification link',
              },
            });
            break;

          case 'AUTH004':
            setErrorState({
              message: 'Password reset required',
              fieldErrors: {
                password: 'Please reset your password',
              },
            });
            break;

          case 'AUTH005':
          case 'AUTH006':
          case 'AUTH007':
            setErrorState({
              message: 'Unable to sign in. Please try again later.',
            });
            break;

          default:
            setErrorState({
              message: 'Unable to sign in. Please try again.',
            });
        }
      } else if (isErrorWithMessage(err)) {
        console.error('Network error:', err);
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
            <Stack spacing={1}>
              <Typography>{errorState.message}</Typography>
              {errorState.helperText && (
                <Typography variant="body2" color="text.secondary">
                  {errorState.helperText}
                </Typography>
              )}
            </Stack>
          </Alert>
        )}
        <Typography variant="h4" fontWeight="600">
          Sign in
        </Typography>
        <SignInForm
          onSubmit={handleSignIn}
          isLoading={signInIsLoading || getTokenIsLoading}
          fieldErrors={errorState.fieldErrors}
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
