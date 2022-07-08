import {
  Box,
  FormControl,
  Stack,
  styled,
  Theme,
  Typography,
} from '@mui/material';
// import {styled} from '@mui/system';
import GoogleIcon from '@mui/icons-material/Google';
import {useFormik} from 'formik';
import {object, string} from 'yup';

import {Input} from './Input';
import {PrimaryButton, SecondaryButton} from './Button';
import {SignInRequest} from '../../services/auth';

interface SignInFormProps {
  onSubmit: ({email, password}: SignInRequest) => Promise<void>;
}

const validationSchema = object({
  email: string().email().required('email is required'),
  password: string()
    .required('password is required')
    .min(8, 'password must be at least 8 characters')
    .matches(/^(?=.*[a-z])/, 'Must contain at least one lowercase character')
    .matches(/^(?=.*[A-Z])/, 'Must contain at least one uppercase character')
    .matches(
      /^(?=.*[!@#%&])/,
      'password must contain at least one special character',
    ),
});

export const SignInForm = ({onSubmit}: SignInFormProps) => {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: values => {
      onSubmit(values);
    },
  });

  console.log(formik.errors.email);

  return (
    <FormContainer>
      <FormHeader variant="h4">Sign in to your account</FormHeader>
      <Form onSubmit={formik.handleSubmit}>
        <FormControl>
          <Input
            fullWidth
            label="Email Address"
            id="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            errors={formik.errors.email}
            touched={formik.touched.email}
          />
        </FormControl>
        <FormControl>
          <Input
            fullWidth
            label="Password"
            id="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            errors={formik.errors.password}
            touched={formik.touched.password}
          />
        </FormControl>
        <SubmitButton type="submit" fullWidth>
          Sign in
        </SubmitButton>
      </Form>
      <Divider>
        <div />
        <p>or</p>
        <div />
      </Divider>
      {/* <SocialSignInLink
        fullWidth
        href={`https://homeuudemo.auth.us-east-1.amazoncognito.com/oauth2/authorize?client_id=${import.meta.env.VITE_COGNITO_CLIENT_ID}&response_type=code&scope=email+openid+phone+profile+aws.cognito.signin.user.admin&redirect_uri=${import.meta.env.VITE_COGNITO_REDIRECT_URI}&identity_provider=Google`}
      > */}
      <SocialSignInLink
        fullWidth
        href={`https://homeuudemo.auth.us-east-1.amazoncognito.com/oauth2/authorize?client_id=${
          import.meta.env.VITE_COGNITO_CLIENT_ID
        }&response_type=code&scope=email+openid+phone+profile+aws.cognito.signin.user.admin&redirect_uri=${
          import.meta.env.VITE_COGNITO_REDIRECT_URI
        }&identity_provider=Google`}
      >
        <GoogleIcon /> Sign in with Google
      </SocialSignInLink>
    </FormContainer>
  );
};

const FormContainer = styled(Stack)(({theme}: {theme: Theme}) => ({
  maxWidth: '550px',
  alignItems: 'center',
  padding: '2rem',
  border: '1px solid #e0e0e0',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#fff',
  margin: '0 16px',
}));

const FormHeader = styled(Typography)({
  textAlign: 'center',
  marginBottom: '16px',
  fontWeight: 600,
});

const Form = styled('form')({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  marginBottom: '16px',
});

const SubmitButton = styled(PrimaryButton)({
  padding: '8px',
});

const Divider = styled(Box)(({theme}: {theme: Theme}) => ({
  color: theme.palette.text.secondary,
  marginBottom: '16px',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  '&> p': {
    margin: '0 8px',
  },
  '& > div': {
    flex: 1,
    backgroundColor: theme.palette.text.secondary,
    height: '1px',
  },
}));

const SocialSignInLink = styled(SecondaryButton)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '8px',
  textDecoration: 'none',
  '& > svg': {
    marginRight: '4px',
    fontSize: '16px',
  },
});
