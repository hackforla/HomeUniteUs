import React from 'react';
import {
  OutlinedInput,
  Stack,
  InputLabel,
  FormHelperText,
  Button,
} from '@mui/material';
import {styled} from '@mui/system';
import {useFormik} from 'formik';
import {object, string} from 'yup';
import {VerificationRequest} from '../../services/auth';

interface AccountVerificationFormProps {
  onSubmit: ({email, code}: VerificationRequest) => Promise<void>;
}

const codeValidationSchema = object({
  email: string().email().required('email is required'),
  code: string()
    .required('code is required')
    .length(6, 'code must be 6 characters'),
});

export const AccountVerificationForm = ({
  onSubmit,
}: AccountVerificationFormProps) => {
  const {handleSubmit, handleChange, values, touched, errors} = useFormik({
    initialValues: {
      email: '',
      code: '',
    },
    validationSchema: codeValidationSchema,
    onSubmit: values => {
      onSubmit(values);
    },
  });

  return (
    <Form onSubmit={handleSubmit}>
      <Stack spacing={1}>
        <InputLabel htmlFor="email">Email address</InputLabel>
        <OutlinedInput
          fullWidth
          id="email"
          value={values.email}
          onChange={handleChange}
          error={touched.email && Boolean(errors.email)}
        />
        {touched.email && errors.email && (
          <FormHelperText error>{errors.email}</FormHelperText>
        )}
      </Stack>
      <Stack spacing={1}>
        <InputLabel htmlFor="code">Verification Code</InputLabel>
        <OutlinedInput
          fullWidth
          id="code"
          value={values.code}
          onChange={handleChange}
          error={touched.code && Boolean(errors.code)}
        />
        {touched.code && errors.code && (
          <FormHelperText error>{errors.code}</FormHelperText>
        )}
      </Stack>
      <Stack direction="row" justifyContent="end" alignItems="center" gap={1}>
        <Button size="large">Resend code</Button>
        <Button variant="contained" size="large" type="submit">
          Submit code
        </Button>
      </Stack>
    </Form>
  );
};

const Form = styled('form')({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: '1rem',
});
