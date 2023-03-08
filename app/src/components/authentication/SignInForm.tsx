import {
  OutlinedInput,
  FormHelperText,
  InputLabel,
  Button,
  Stack,
  styled,
  Divider,
  Link,
  Alert,
  Collapse,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GoogleIcon from '@mui/icons-material/Google';
import {useFormik} from 'formik';
import {object, string} from 'yup';

import {SignInRequest} from '../../services/auth';

interface SignInFormProps {
  onSubmit: ({email, password}: SignInRequest) => Promise<void>;
  errorMessage?: string;
  setErrorMessage?: React.Dispatch<React.SetStateAction<string>>;
}

const validationSchema = object({
  email: string().email().required('email is required'),
  password: string()
    .required('password is required')
    .matches(/^(?=.*[0-9])/, 'password must contain at least one number')
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
});

export const SignInForm = ({
  onSubmit,
  setErrorMessage,
  errorMessage,
}: SignInFormProps) => {
  const {handleSubmit, handleChange, values, touched, errors} = useFormik({
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
    <Form onSubmit={handleSubmit}>
      <Stack spacing={1}>
        <InputLabel htmlFor="email">Email address</InputLabel>
        <OutlinedInput
          fullWidth
          id="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          error={touched.email && Boolean(errors.email)}
        />
        {touched.email && errors.email && (
          <FormHelperText error>{errors.email}</FormHelperText>
        )}
      </Stack>
      <Stack spacing={1}>
        <InputLabel htmlFor="password">Password</InputLabel>
        <OutlinedInput
          fullWidth
          id="password"
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          error={touched.password && Boolean(errors.password)}
        />
        {touched.password && errors.password && (
          <FormHelperText error>{errors.password}</FormHelperText>
        )}
      </Stack>
      <Stack direction="row">
        <Link fontWeight="bold" href="/forgot-password">
          forgot password?
        </Link>
      </Stack>
      <Button variant="contained" size="large" type="submit" fullWidth>
        Sign in
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
                if (setErrorMessage) {
                  setErrorMessage('');
                }
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {errorMessage}
        </Alert>
      </Collapse>
      <Divider>or</Divider>
      <Button
        variant="outlined"
        color="secondary"
        size="large"
        fullWidth
        // overrides the default react router link since we're hitting a redirect from the api
        component="a"
        href={'/api/auth/google?redirect_uri=http://localhost:4040/signin'}
      >
        <GoogleIcon sx={{fontSize: 16, marginRight: 1}} /> Sign in with Google
      </Button>
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
