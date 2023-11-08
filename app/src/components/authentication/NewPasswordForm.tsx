import {Button, Stack, CircularProgress} from '@mui/material';
import {useFormik} from 'formik';
import {object, string, ref} from 'yup';

import {NewPasswordRequest} from '../../services/auth';
import {PasswordField} from './PasswordField';
import {PasswordValidation} from '../common/PasswordValidation';

interface NewPasswordFormProps {
  onSubmit: ({password, confirmPassword}: NewPasswordRequest) => Promise<void>;
  sessionId: string | null;
  userId: string | null;
  isLoading: boolean;
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
  userId,
  sessionId,
  isLoading,
}: NewPasswordFormProps) => {
  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values: {password, confirmPassword},
    touched,
    errors,
  } = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
      sessionId,
      userId,
    },
    validationSchema,
    onSubmit: values => {
      onSubmit(values);
    },
  });

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit}
      spacing={4}
      sx={{width: '100%'}}
    >
      <PasswordField
        fullWidth
        label="Password"
        id="password"
        name="password"
        autoComplete="current-password"
        value={password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.password && Boolean(errors.password)}
        helperText={touched.password && errors.password}
        inputProps={{
          'aria-label': 'password',
        }}
      />
      <PasswordField
        fullWidth
        label="Confirm Password"
        id="confirmPassword"
        name="confirmPassword"
        autoComplete="current-password"
        value={confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.confirmPassword && Boolean(errors.confirmPassword)}
        helperText={touched.confirmPassword && errors.confirmPassword}
        inputProps={{
          'aria-label': 'password',
        }}
      />
      {password ? (
        <PasswordValidation
          confirmPassword={confirmPassword}
          password={password}
        />
      ) : null}
      <Button variant="contained" size="large" type="submit" fullWidth>
        Submit
        {isLoading ? (
          <CircularProgress sx={{mx: 1}} size={20} color="inherit" />
        ) : null}
      </Button>
    </Stack>
  );
};
