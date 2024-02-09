import React from 'react';
import {NewPasswordForm} from '../components/authentication/NewPasswordForm';
import {useSearchParams} from 'react-router-dom';
import {Typography, Stack, Alert, IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {NewPasswordRequest, useNewPasswordMutation} from '../services/auth';
import {useNavigate} from 'react-router-dom';
import {isFetchBaseQueryError, isErrorWithMessage} from '../app/helpers';
import {FormContainer} from '../components/authentication';

export const NewPassword = () => {
  const [errorMessage, setErrorMessage] = React.useState('');

  const [searchParams] = useSearchParams();
  const session_id = searchParams.get('sessionId');
  const user_id = searchParams.get('userId');
  const errorParam = searchParams.get('error');

  const navigate = useNavigate();
  const [newPassword, {isLoading}] = useNewPasswordMutation();

  const handleNewPassword = async ({
    password,
    confirmPassword,
    userId,
    sessionId,
  }: NewPasswordRequest) => {
    try {
      await newPassword({
        password,
        confirmPassword,
        userId,
        sessionId,
      }).unwrap();

      navigate('/guest');
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

  if (errorParam) {
    return (
      <FormContainer>
        <Alert sx={{width: '100%'}} severity="error">
          {errorParam}
        </Alert>
      </FormContainer>
    );
  }

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
          New Password
        </Typography>
        <Typography color="text.secondary">
          Welcome! Before we get started please create a new password for your
          account.
        </Typography>
        <NewPasswordForm
          onSubmit={handleNewPassword}
          sessionId={session_id}
          userId={user_id}
          isLoading={isLoading}
        />
      </Stack>
    </FormContainer>
  );
};
