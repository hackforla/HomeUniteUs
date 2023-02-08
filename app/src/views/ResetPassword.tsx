import {
  Button,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material';
import {useFormik} from 'formik';
import React from 'react';
import {object, ref, string} from 'yup';
import {useForgotPasswordMutation} from '../services/auth';

const validationSchema = object({
  password: string()
    .required('password is required')
    .min(8, 'password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])/,
      'password must contain at least one lowercase character',
    )
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
  code: string().required('code is required'),
});

export const ResetPassword = () => {
  const {
    handleSubmit,
    handleChange,
    values: {password, confirmPassword, code},
    touched,
    errors,
  } = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
      code: '',
    },
    validationSchema,
    onSubmit: values => {
      onSubmit(values);
    },
  });

  const [forgotPassword] = useForgotPasswordMutation();

  const onSubmit = async ({password, code}) => {
    try {
      const response = await forgotPassword({password, code}).unwrap();
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Stack
      spacing={2}
      sx={{justifyContent: 'center', alignItems: 'flex-start', p: 4}}
    >
      <Typography variant="h4">Reset Password</Typography>
      <Stack
        component="form"
        spacing={2}
        sx={{minWidth: '350px', alignItems: 'flex-start'}}
        onSubmit={handleSubmit}
      >
        <Stack spacing={1} sx={{width: '100%'}}>
          <InputLabel htmlFor="password">Password</InputLabel>
          <OutlinedInput
            fullWidth
            id="password"
            name="password"
            value={password}
            onChange={handleChange}
            error={touched.password && Boolean(errors.password)}
          />
          {touched.password && errors.password && (
            <FormHelperText error>{errors.password}</FormHelperText>
          )}
        </Stack>
        <Stack spacing={1} sx={{width: '100%'}}>
          <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
          <OutlinedInput
            fullWidth
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
            error={touched.confirmPassword && Boolean(errors.confirmPassword)}
          />
          {touched.confirmPassword && errors.confirmPassword && (
            <FormHelperText error>{errors.confirmPassword}</FormHelperText>
          )}
        </Stack>
        <Stack spacing={1} sx={{width: '100%'}}>
          <InputLabel htmlFor="code">Code</InputLabel>
          <OutlinedInput
            fullWidth
            id="code"
            name="code"
            value={code}
            onChange={handleChange}
            // error={touched.email && Boolean (errors.email)}
          />
          {/* {touched.email && errors.email && (
            <FormHelperText error>{errors.email}</FormHelperText>
          )} */}
        </Stack>

        <Button variant="contained" size="large" type="submit">
          Submit
        </Button>
      </Stack>
    </Stack>
  );
};
