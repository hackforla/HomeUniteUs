import {
  Alert,
  Button,
  Collapse,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {useFormikContext} from 'formik';
import React from 'react';
import {isErrorWithMessage, isFetchBaseQueryError} from '../app/helpers';
import {ResestPasswordValues} from '../components/authentication/ResetPasswordContext';
import {useForgotPasswordMutation} from '../services/auth';

export const ForgotPassword = () => {
  const [errorMessage, setErrorMessage] = React.useState('');

  const {
    values: {email},
    errors,
    touched,
    handleChange,
    handleBlur,
  } = useFormikContext<ResestPasswordValues>();

  const [forgotPassword] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await forgotPassword({email}).unwrap();
      console.log(response);
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
    <Stack
      spacing={2}
      sx={{justifyContent: 'center', alignItems: 'flex-start', p: 4}}
    >
      <Typography variant="h4">Forgot Password</Typography>
      <Stack
        component="form"
        spacing={2}
        sx={{minWidth: '350px', alignItems: 'flex-start'}}
        onSubmit={handleSubmit}
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
        <Collapse sx={{width: '100%'}} in={errorMessage !== ''}>
          <Alert
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
        </Collapse>
        <Button variant="contained" size="large" type="submit">
          Submit
        </Button>
      </Stack>
    </Stack>
  );
};
