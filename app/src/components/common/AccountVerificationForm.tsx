import React from 'react';
import {FormControl, OutlinedInput, Stack} from '@mui/material';
import {styled} from '@mui/system';
import {useFormik} from 'formik';
import {object, string} from 'yup';
import {PrimaryButton, SecondaryButton} from './Button';
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
  const formik = useFormik({
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
    <Form onSubmit={formik.handleSubmit}>
      <FormControl>
        <Label htmlFor="email">Email address</Label>
        <Input
          fullWidth
          id="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
        />
        <HelperText>{formik.touched.code && formik.errors.code}</HelperText>
      </FormControl>
      <FormControl>
        <Label htmlFor="verification-code">Verification code</Label>
        <Input
          fullWidth
          id="verification-code"
          value={formik.values.code}
          onChange={formik.handleChange}
          error={formik.touched.code && Boolean(formik.errors.code)}
        />
        <HelperText>{formik.touched.code && formik.errors.code}</HelperText>
      </FormControl>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <ResendButton>Resend code</ResendButton>
        <SubmitButton type="submit">Submit code</SubmitButton>
      </Stack>
    </Form>
  );
};

const Form = styled('form')({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  marginBottom: '16px',
});

const Input = styled(OutlinedInput)(({theme}) => ({
  '& > input': {
    padding: '8px 8px',
    fontSize: '16px',
    borderRadius: theme.shape.borderRadius,
  },
}));

const Label = styled('label')(({theme}) => ({
  marginBottom: '4px',
  color: theme.palette.text.secondary,
  fontSize: '16px',
  fontWeight: 500,
}));

const ResendButton = styled(SecondaryButton)({
  padding: '8px 12px',
});

const SubmitButton = styled(PrimaryButton)({
  padding: '8px 12px',
});

const HelperText = styled('div')({
  height: '16px',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  fontSize: '12px',
  color: '#f44336',
});
