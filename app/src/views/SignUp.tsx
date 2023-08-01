import React from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {IconButton, Alert, Typography, Stack} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import {setCredentials} from '../app/authSlice';
import {useAppDispatch} from '../app/hooks/store';
import {SignUpForm} from '../components/authentication/SignUpForm';
import {
  SignUpHostRequest,
  useSignUpHostMutation,
  useGetTokenMutation,
} from '../services/auth';
import {isErrorWithMessage, isFetchBaseQueryError} from '../app/helpers';
import {FormContainer} from '../components/authentication';

export const SignUp = () => {
  const [errorMessage, setErrorMessage] = React.useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [signUp] = useSignUpHostMutation();
  const [getToken, {isLoading: getTokenIsLoading}] = useGetTokenMutation();
  // const locationState = location.state as LocationState;

  // Save location from which user was redirected to login page
  // const from = locationState?.from?.pathname || '/';

  React.useEffect(() => {
    if (location.search.includes('code')) {
      const code = location.search.split('?code=')[1];
      getToken({
        code,
        callbackUri: 'http://localhost:4040/signup',
      })
        .unwrap()
        .then(response => {
          const {token, user} = response;
          dispatch(setCredentials({user, token}));
          navigate('/');
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

  const handleSignUp = async ({email, password}: SignUpHostRequest) => {
    try {
      await signUp({
        email,
        password,
      }).unwrap();

      navigate(`/signup/success?email=${email}`);
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
          Create Account
        </Typography>
        <SignUpForm
          onSubmit={handleSignUp}
          getTokenIsLoading={getTokenIsLoading}
        />
      </Stack>
    </FormContainer>
  );
};
