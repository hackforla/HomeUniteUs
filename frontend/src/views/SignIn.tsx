import React from 'react';
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

import {setCredentials} from '../redux/authSlice';
import {useAppDispatch} from '../redux/hooks/store';
import {SignInForm} from '../components/authentication/SignInForm';
import {
  SignInRequest,
  useGoogleSignInMutation,
  useSignInMutation,
} from '../services/auth';
import {isFetchBaseQueryError, isErrorWithMessage} from '../redux/helpers';
import {FormContainer} from '../components/authentication';
import {
  useAuthenticateWithOAuth,
  redirectsByRole,
} from '../components/authentication/hooks/useAuthenticateWithOAuth';
export interface LocationState {
  from: Location;
}

export const SignIn = () => {
  const [errorMessage, setErrorMessage] = React.useState('');

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
    setErrorMessage,
    callbackUri: '/signin',
  });

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
        // you can access all properties of `FetchBaseQueryError` here
        const errMsg = err.data.message;
        setErrorMessage(errMsg);
      } else if (isErrorWithMessage(err)) {
        // you can access a string 'message' property here
        setErrorMessage(err.message);
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
        {errorMessage ? (
          <Alert
            sx={{width: '100%'}}
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setErrorMessage('');
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {errorMessage}
          </Alert>
        ) : null}
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
