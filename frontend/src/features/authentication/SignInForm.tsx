import {
  Button,
  Stack,
  // Divider,
  Link,
  TextField,
  CircularProgress,
  Divider,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import {useFormik} from 'formik';
import {object, string} from 'yup';
import {SignInRequest} from '../../services/auth';
import {PasswordField} from './PasswordField';

interface SignInFormProps {
  isLoading: boolean;
  onSubmit: ({email, password}: SignInRequest) => Promise<void>;
  getTokenIsLoading?: boolean;
  type?: 'coordinator' | 'guest' | 'host';
}

const validationSchema = object({
  email: string().email().required('email is required'),
  password: string().required('password is required'),
});

export const SignInForm = ({
  onSubmit, 
  isLoading,
  getTokenIsLoading
}: SignInFormProps) => {
  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values: {email, password},
    touched,
    errors,
    isValid,
    dirty,
  } = useFormik({
    initialValues: {
      email: '',
      password: '',
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
      <TextField
        fullWidth
        autoComplete="username"
        id="email"
        name="email"
        label="Email address"
        value={email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.email && Boolean(errors.email)}
        helperText={touched.email && errors.email}
      />
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
      <Stack direction="row" justifyContent="flex-end">
        <Link underline="always" href="/forgot-password">
          Forgot password?
        </Link>
      </Stack>
      <Button
        disabled={!isValid || !dirty || isLoading}
        variant="contained"
        size="large"
        type="submit"
        fullWidth
      >
        Sign in
        {isLoading ? (
          <CircularProgress sx={{mx: 1}} size={20} color="inherit" />
        ) : null}
      </Button>
      {/* TODO: ADD THIS BACK ONCE GOOGLE AUTH IS SETUP */}
      <Divider>or</Divider>
      <Button
        disabled={getTokenIsLoading}
        variant="outlined"
        size="large"
        fullWidth
        sx={{color: 'text.primary'}}
        // overrides the default react router link since we're hitting a redirect from the api
        component="a"
        href={'/api/auth/google?redirect_uri=/signin'}
      >
        <GoogleIcon sx={{fontSize: 16, marginRight: 1}} /> Continue with Google
        {getTokenIsLoading ? (
          <CircularProgress sx={{mx: 1}} size={20} color="inherit" />
        ) : null}
      </Button>
    </Stack>
  );
};
