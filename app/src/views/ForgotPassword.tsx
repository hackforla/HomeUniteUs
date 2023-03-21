import {
  Alert,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {useFormikContext} from 'formik';
import React from 'react';
import {useNavigate} from 'react-router-dom';
import {isErrorWithMessage, isFetchBaseQueryError} from '../app/helpers';
import {ResestPasswordValues} from '../components/authentication/ResetPasswordContext';
import {useForgotPasswordMutation} from '../services/auth';
import {FormContainer} from '../components/authentication';

export const ForgotPassword = () => {
  const [errorMessage, setErrorMessage] = React.useState('');
  const navigate = useNavigate();

  const {
    values: {email},
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldTouched,
    validateForm,
  } = useFormikContext<ResestPasswordValues>();

  const [forgotPassword] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formErrors = await validateForm();
    if (formErrors.email) {
      setFieldTouched('email', true);
      return;
    }

    try {
      await forgotPassword({email}).unwrap();
      navigate('code');
    } catch (err) {
      console.log(err);
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
        <Typography variant="h4">Forgot Password</Typography>
        <Stack
          component="form"
          sx={{width: '100%', alignItems: 'flex-start'}}
          onSubmit={handleSubmit}
          spacing={4}
        >
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            value={email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email && Boolean(errors.email)}
            helperText={touched.email && errors.email}
          />
          <Button fullWidth variant="contained" size="large" type="submit">
            Submit
          </Button>
          <Button href="/signin" fullWidth variant="outlined">
            Back
          </Button>
        </Stack>
      </Stack>
    </FormContainer>
  );
};
