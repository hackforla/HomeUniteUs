import {Button, Stack, FormHelperText, Typography, Box} from '@mui/material';
import {useFormikContext} from 'formik';
import React from 'react';
import {ResestPasswordValues} from '../components/authentication/ResetPasswordContext';
import {CodeField, FormContainer} from '../components/authentication';
import {useNavigate} from 'react-router-dom';

export const ForgotPasswordCode = () => {
  const navigate = useNavigate();

  const {errors, touched, setFieldValue, handleBlur} =
    useFormikContext<ResestPasswordValues>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (errors.code) return;
    navigate('/forgot-password/reset');
  };

  const setCode = (code: string) => {
    setFieldValue('code', code);
  };

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
          spacing={2}
          sx={{alignItems: 'center'}}
          onSubmit={handleSubmit}
        >
          <Stack spacing={1} sx={{width: '100%'}}>
            <CodeField
              id="code"
              onChange={setCode}
              onBlur={handleBlur}
              error={touched.code && Boolean(errors.code)}
            />
            {touched.code && errors.code ? (
              <FormHelperText error>{errors.code}</FormHelperText>
            ) : null}
          </Stack>
          <Button fullWidth variant="contained" size="large" type="submit">
            Submit
          </Button>
        </Stack>
      </Stack>
    </FormContainer>
  );
};
