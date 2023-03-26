import React from 'react';
import {
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Stack,
  Button,
  Alert,
  Collapse,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {styled} from '@mui/system';
import {useFormik} from 'formik';
import {object, ref, string} from 'yup';
import {NewPasswordRequest} from '../../services/auth';

interface NewPasswordFormProps {
  onSubmit: ({password, confirmPassword}: NewPasswordRequest) => Promise<void>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  errorMessage: string;
}

const validationSchema = object({
  password: string()
    .required('password is required')
    .min(8, 'password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])/,
      'password must contain at least one lowercase character',
    )
    .matches(/^(?=.*[0-9])/, 'password must contain at least one number')
    .matches(
      /^(?=.*[A-Z])/,
      'password must contain at least one uppercase character',
    )
    .matches(
      /^(?=.*[!@#%&])/,
      'password must contain at least one special character',
    ),
  confirmPassword: string()
    .required('confirm password is required')
    .oneOf([ref('password'), null], 'passwords must match'),
});

export const NewPasswordForm = ({
  onSubmit,
  errorMessage,
  setErrorMessage,
}: NewPasswordFormProps) => {
  const {handleSubmit, handleChange, values, touched, errors} = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: values => {
      onSubmit(values);
    },
  });

  return (
    <Form onSubmit={handleSubmit}>
      <Stack spacing={1}>
        <InputLabel htmlFor="password">Password:</InputLabel>
        <OutlinedInput
          fullWidth
          id="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          error={touched.password && Boolean(errors.password)}
        />
        {touched.password && errors.password && (
          <FormHelperText error>{errors.password}</FormHelperText>
        )}
      </Stack>
      <Stack spacing={1}>
        <InputLabel htmlFor="confirmPassword">Confirm Password:</InputLabel>
        <OutlinedInput
          fullWidth
          id="confirmPassword"
          type="password"
          value={values.confirmPassword}
          onChange={handleChange}
          error={touched.confirmPassword && Boolean(errors.confirmPassword)}
        />
        {touched.confirmPassword && errors.confirmPassword && (
          <FormHelperText error>{errors.confirmPassword}</FormHelperText>
        )}
      </Stack>
      <Button variant="contained" size="large" type="submit" fullWidth>
        Change Password
      </Button>
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
