import React from 'react';
import {useNavigate, useLocation, Location} from 'react-router-dom';
import {
  Typography,
  Stack,
  Link,
  Divider,
  Alert,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import {setCredentials} from '../app/authSlice';
import {useAppDispatch} from '../app/hooks/store';
import {SignInForm} from '../components/authentication/SignInForm';
import {
  SignInRequest,
  useSignInMutation,
  useGetTokenMutation,
} from '../services/auth';
import {isFetchBaseQueryError, isErrorWithMessage} from '../app/helpers';
import {FormContainer} from '../components/authentication';
export interface LocationState {
  from: Location;
}

export const SignIn = () => {
  const [errorMessage, setErrorMessage] = React.useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [signIn, {isLoading: signInIsLoading}] = useSignInMutation();
  const [getToken, {isLoading: getTokenIsLoading}] = useGetTokenMutation();
  // const locationState = location.state as LocationState;

  // Save location from which user was redirected to login page
  // const from = locationState?.from?.pathname || '/';

  React.useEffect(() => {
    if (location.search.includes('code')) {
      const code = location.search.split('?code=')[1];
      getToken({
        code,
        callbackUri: '/signin',
      })
        .unwrap()
        .then(response => {
          const {token, user} = response;
          dispatch(setCredentials({user, token}));
          navigate('/coordinator');
        })
        .catch(err => {
          if (isFetchBaseQueryError(err)) {
            // you can access all properties of `FetchBaseQueryError` here
            const errMsg = err.data.message;
            setErrorMessage(errMsg);
          } else if (isErrorWithMessage(err)) {
            // you can access a string 'message' property here
            setErrorMessage(err.message);
          }
        });
    }
  }, [location]);

  const handleSignIn = async ({email, password}: SignInRequest) => {
    try {
      const response = await signIn({
        email,
        password,
      }).unwrap();

      const {user, token} = response;

      dispatch(setCredentials({user, token}));

      const routes = {
        Guest: '/guest',
        Host: '/host',
        Coordinator: '/coordinator',
        Admin: '/coordinator',
      };

      navigate(routes[user.role.name]);
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
          signInIsLoading={signInIsLoading}
          getTokenIsLoading={getTokenIsLoading}
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
