import React from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {
  Stack,
  Typography,
  styled,
  Dialog,
  DialogTitle,
  Alert,
  Collapse,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import {setCredentials} from '../app/authSlice';
import {useAppDispatch} from '../app/hooks/store';
import {SignUpForm} from '../components/authentication/SignUpForm';
import {
  SignUpRequest,
  useSignUpMutation,
  useGetTokenMutation,
} from '../services/auth';
// import {LocationState} from './SignIn';
import logo from '../img/favicon.png';
import {Header} from '../components/common';

export const SignUp = () => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [, setAlertOpen] = React.useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [signUp, {error}] = useSignUpMutation();
  const [getToken] = useGetTokenMutation();
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
          console.log(err);
          setAlertOpen(true);
        });
    }
  }, [location]);

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleSignUp = async ({email, password}: SignUpRequest) => {
    await signUp({
      email,
      password,
    })
      .unwrap()
      .then(() => {
        // console.log('signup response', response);
        setDialogOpen(true);
      })
      .catch(err => {
        console.log('signup error', err.data.message);
        // setAlertOpen(true);
      });
  };

  console.log('redux error', error);

  return (
    <Header>
      <>
        <PageContainer>
          <FormContainer gap={2}>
            <Logo src={logo} alt="Home Unite Us logo" />
            <FormHeader variant="h4">Sign up for an account</FormHeader>
            <SignUpForm onSubmit={handleSignUp} />
            <Collapse sx={{width: '100%'}} in={error !== undefined}>
              <Alert
                severity="error"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setAlertOpen(false);
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                {error?.data?.message}
              </Alert>
            </Collapse>
          </FormContainer>
        </PageContainer>
        <EmailVerificationDialog open={dialogOpen} handleClose={handleClose} />
      </>
    </Header>
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
