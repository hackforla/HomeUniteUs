import {
  Alert,
  Button,
  Collapse,
  IconButton,
  Stack,
  FormHelperText,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {useFormikContext} from 'formik';
import React from 'react';
import {ResestPasswordValues} from '../components/authentication/ResetPasswordContext';
import {OneTimePasswordField} from '../components/authentication';

export const ForgotPasswordCode = () => {
  const [errorMessage, setErrorMessage] = React.useState('');

  const {
    values: {code},
    errors,
    touched,
    setFieldValue,
    handleBlur,
  } = useFormikContext<ResestPasswordValues>();

  // const [forgotPassword] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(code);
  };

  const setCode = (code: string) => {
    setFieldValue('code', code);
  };

  return (
    <Stack
      spacing={2}
      sx={{justifyContent: 'center', alignItems: 'flex-start', p: 4}}
    >
      <Typography variant="h4">Verification Code</Typography>
      <Typography variant="body1">enter the code sent to your email</Typography>
      <Stack
        component="form"
        spacing={2}
        sx={{minWidth: '350px', alignItems: 'flex-start'}}
        onSubmit={handleSubmit}
      >
        <Stack spacing={1} sx={{width: '100%'}}>
          <OneTimePasswordField
            id="code"
            onChange={setCode}
            onBlur={handleBlur}
            error={touched.code && Boolean(errors.code)}
          />
          {touched.code && errors.code ? (
            <FormHelperText error>{errors.code}</FormHelperText>
          ) : null}
        </Stack>
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
