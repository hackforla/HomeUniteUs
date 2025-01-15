import React from 'react';
import {
  IconButton,
  Alert,
  Typography,
  Stack,
  Divider,
  Link,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {useNavigate, useParams} from 'react-router-dom';

import {
  useGoogleSignUpMutation,
  useSignUpMutation,
  SignUpRequest,
} from '../../services/auth';
import {isErrorWithMessage, isFetchBaseQueryError} from '../../redux/helpers';
import {useAuthenticateWithOAuth} from '../../features/authentication/hooks/useAuthenticateWithOAuth';
import {FormContainer, SignUpForm} from '../../features/authentication';

export const SignUp = () => {
  const [errorMessage, setErrorMessage] = React.useState('');
  const {type} = useParams();
  const navigate = useNavigate();

  const [signUp, {isLoading: signUpIsLoading}] = useSignUpMutation();

  const [googleSignUp, {isLoading: getTokenIsLoading}] =
    useGoogleSignUpMutation();
  // get type from params
  // const locationState = location.state as LocationState;

  // Save location from which user was redirected to login page
  // const from = locationState?.from?.pathname || '/';

  const callbackUri = `/signup/${type}`;
  useAuthenticateWithOAuth({
    query: googleSignUp,
    setErrorMessage,
    callbackUri,
  });

  const handleSignUp = async ({
    email,
    password,
    firstName,
    lastName,
  }: Omit<SignUpRequest, 'role'>) => {
    if (!type) {
      throw new Error('User type is required');
    }

    try {
      await signUp({
        email,
        password,
        firstName,
        lastName,
        role: type,
      }).unwrap();

      navigate(`/signup/success?email=${email}`);
    } catch (err) {
      if (isFetchBaseQueryError(err)) {
        const errMsg = err.data?.detail?.message || 'Failed to sign up';
        setErrorMessage(errMsg);
      } else if (isErrorWithMessage(err)) {
        setErrorMessage(
          'Unable to connect. Please check your internet connection.',
        );
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
          isLoading={signUpIsLoading || getTokenIsLoading}
        />
        <Divider sx={{width: '100%'}} />
        <Stack direction="row" justifyContent="flex-end" gap={0.5}>
          <Typography>Already an account?</Typography>
          <Link underline="always" href="/signin">
            Sign in
          </Link>
        </Stack>
      </Stack>
    </FormContainer>
  );
};
