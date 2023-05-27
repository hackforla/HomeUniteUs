import {
  Button,
  Stack,
  FormHelperText,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import {useFormikContext} from 'formik';
import React from 'react';
import {ResestPasswordValues} from '../components/authentication/ResetPasswordContext';
import {CodeField, FormContainer} from '../components/authentication';
import {useNavigate} from 'react-router-dom';

export const ForgotPasswordCode = () => {
  const navigate = useNavigate();

  const {
    values: {code, email},
    errors,
    touched,
    setFieldValue,
  } = useFormikContext<ResestPasswordValues>();
  console.log(code);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (errors.code) return;
    navigate('/forgot-password/reset');
  };

  const setCode = (code: string) => {
    setFieldValue('code', code);
  };

  if (!email) {
    return (
      <FormContainer>
        <Alert sx={{width: '100%'}} severity="error">
          Whoops! This action relies on data collected in previous steps that is
          currently missing. Please restart the process if you would still like
          to reset your password.
        </Alert>
      </FormContainer>
    );
  }

  return (
    <FormContainer>
      <Stack spacing={4} sx={{justifyContent: 'center', alignItems: 'center'}}>
        <Box>
          <Typography mb={1} variant="h4">
            Verification Code
          </Typography>
          <Typography variant="body1">
            enter the code sent to your email
          </Typography>
        </Box>
        <Stack
          component="form"
          spacing={4}
          sx={{alignItems: 'center'}}
          onSubmit={handleSubmit}
        >
          <Stack spacing={1} sx={{width: '100%'}}>
            <CodeField
              id="code"
              onChange={setCode}
              error={touched.code && Boolean(errors.code)}
            />
            {touched.code && errors.code ? (
              <FormHelperText error>{errors.code}</FormHelperText>
            ) : null}
          </Stack>
          <Button
            disabled={code.length < 6}
            fullWidth
            variant="contained"
            size="large"
            type="submit"
          >
            Submit
          </Button>
          <Button href="/forgot-password" fullWidth variant="outlined">
            Back
          </Button>
        </Stack>
      </Stack>
    </FormContainer>
  );
};
