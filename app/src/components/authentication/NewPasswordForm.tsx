import {useFormik} from 'formik';
import React from 'react';
import {useNavigate} from 'react-router-dom';
import {object, string, ref} from 'yup';
import {
  Typography,
  Stack,
  Alert,
  Button,
  CircularProgress,
} from '@mui/material';
import {useNewPasswordMutation} from '../../services/auth';
import {FormContainer, PasswordField} from '.';
import {getErrorMessage} from '../../app/helpers';

export interface NewPasswordValues {
  password: string;
  confirmPassword: string;
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

const initialValues = {
  password: '',
  confirmPassword: '',
};

export const NewPasswordForm = () => {
  const navigate = useNavigate();
  const {
    handleSubmit,
    handleChange,
    values: {password, confirmPassword},
    touched,
    errors,
    handleBlur,
    // setFieldTouched,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async values => {
      try {
        await newPassword(values).unwrap();
        navigate('/');
      } catch (err) {
        console.log({err});
      }
    },
  });

  const [newPassword, {error, isError, isLoading}] = useNewPasswordMutation();

  return (
    <FormContainer>
      <Stack spacing={4} sx={{justifyContent: 'center', alignItems: 'center'}}>
        {isError ? (
          <Alert sx={{width: '100%'}} severity="error">
            {getErrorMessage(error)}
          </Alert>
        ) : null}
        <Typography variant="h4">Enter a New Password:</Typography>
        <Stack
          component="form"
          spacing={4}
          sx={{width: '100%', alignItems: 'flex-start'}}
          onSubmit={handleSubmit}
        >
          <PasswordField
            fullWidth
            label="New password"
            id="password"
            name="password"
            value={password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password && Boolean(errors.password)}
            helperText={touched.password && errors.password}
          />
          <PasswordField
            fullWidth
            label="Confirm new password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.confirmPassword && Boolean(errors.confirmPassword)}
            helperText={touched.confirmPassword && errors.confirmPassword}
          />
          <Button
            disabled={isLoading}
            fullWidth
            variant="contained"
            size="large"
            type="submit"
          >
            Submit
            {isLoading ? (
              <CircularProgress sx={{mx: 1}} size={20} color="inherit" />
            ) : null}
          </Button>
        </Stack>
      </Stack>
    </FormContainer>
  );
};
