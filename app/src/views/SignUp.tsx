import React from 'react';
import {useNavigate, useLocation, useParams} from 'react-router-dom';
import {Stack, Typography, styled, Dialog, DialogTitle} from '@mui/material';
import {setCredentials} from '../app/authSlice';
import {useAppDispatch} from '../app/hooks/store';
import {SignUpForm} from '../components/authentication/SignUpForm';
import {
  SignUpHostRequest,
  SignUpCoordinatorRequest,
  useSignUpHostMutation,
  useSignUpCoordinatorMutation,
  useGetTokenMutation,
} from '../services/auth';
// import {LocationState} from './SignIn';
import logo from '../img/favicon.png';
import {isErrorWithMessage, isFetchBaseQueryError} from '../app/helpers';

export const SignUp = () => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const {type} = useParams();

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [signUpHost] = useSignUpHostMutation();
  const [signUpCoordinator] = useSignUpCoordinatorMutation();
  const [getToken] = useGetTokenMutation();
  // get type from params
  // const locationState = location.state as LocationState;

  // Save location from which user was redirected to login page
  // const from = locationState?.from?.pathname || '/';

  React.useEffect(() => {
    if (location.search.includes('code')) {
      const code = location.search.split('?code=')[1];
      getToken({
        code,
        callbackUri: 'http://localhost:4040/signup',
      })
        .unwrap()
        .then(response => {
          const {token, user} = response;
          dispatch(setCredentials({user, token}));
          navigate('/');
        })
        .catch(err => {
          if (isFetchBaseQueryError(err)) {
            // you can access all properties of `FetchBaseQueryError` here
            const errMsg = err.data.message;
            setErrorMessage(errMsg);
          } else if (isErrorWithMessage(err)) {
            // you can access a string 'message' property here
            setErrorMessage(err.message);
          }
        });
    }
  }, [location]);

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleSignUp = async ({
    email,
    password,
  }: SignUpHostRequest | SignUpCoordinatorRequest) => {
    try {
      if (type === 'host') {
        await signUpHost({
          email,
          password,
        }).unwrap();
      }

      if (type === 'coordinator') {
        await signUpCoordinator({
          email,
          password,
        }).unwrap();
      }

      setDialogOpen(true);
    } catch (err) {
      if (isFetchBaseQueryError(err)) {
        // you can access all properties of `FetchBaseQueryError` here
        const errMsg = err.data.message;
        setErrorMessage(errMsg);
      } else if (isErrorWithMessage(err)) {
        // you can access a string 'message' property here
        setErrorMessage(err.message);
      }
    }
  };

  return (
    <>
      <PageContainer>
        <FormContainer gap={2}>
          <Logo src={logo} alt="Home Unite Us logo" />
          <FormHeader variant="h4">Sign up for an account</FormHeader>
          <SignUpForm
            onSubmit={handleSignUp}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            type={type}
          />
        </FormContainer>
      </PageContainer>
      <EmailVerificationDialog open={dialogOpen} handleClose={handleClose} />
    </>
  );
};

interface EmailVerificationDialogProps {
  open: boolean;
  handleClose: () => void;
}

const EmailVerificationDialog = ({
  open,
  handleClose,
}: EmailVerificationDialogProps) => {
  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>
        We have sent a link to your email. Please verify your email address
      </DialogTitle>
    </Dialog>
  );
};

const Logo = styled('img')({
  width: '100px',
  height: '100px',
});

const PageContainer = styled('div')(({theme}) => ({
  backgroundColor: theme.palette.grey[100],
  display: 'flex',
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2rem 0',
}));

const FormContainer = styled(Stack)(({theme}) => ({
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
  fontWeight: 600,
});
