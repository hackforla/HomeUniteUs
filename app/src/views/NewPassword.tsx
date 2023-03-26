import React, {useState} from 'react';
import {Location} from 'react-router-dom';
import {
  Typography,
  Stack,
  styled,
  Theme,
  Dialog,
  DialogTitle,
  Box,
} from '@mui/material';

// import {setCredentials} from '../app/authSlice';
// import {useAppDispatch} from '../app/hooks/store';
import {NewPasswordForm} from '../components/authentication/NewPasswordForm';
// import {NewPasswordRequest} from '../services/auth';
// import {
//   SignInRequest,
//   useSignInMutation,
//   useGetTokenMutation,
// } from '../services/auth';
export interface LocationState {
  from: Location;
}

export const NewPassword = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // const handleNewPassword = async ({
  //   password,
  //   confirmPassword,
  // }: NewPasswordRequest) => {
  //   try {
  //     // api call here
  //   } catch (err) {
  //     // handle error here
  //   }
  // };

  const handleClose = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <PageContainer>
        <FormContainer gap={2}>
          {/* <Logo src={logo} alt="Home Unite Us logo" /> */}
          <FormHeader variant="h4">New Password</FormHeader>
          <NewPasswordForm
            onSubmit={handleNewPassword}
            setErrorMessage={setErrorMessage}
            errorMessage={errorMessage}
          />
          {/* <Stack direction="row" alignItems="center" gap={0.5}>
            <Typography variant="body2">Don&apos;t have an account?</Typography>
            <Link fontWeight="bold" href="/signup">
              Sign up
            </Link>
          </Stack> */}
        </FormContainer>
      </PageContainer>
      <NewPasswordDialog open={dialogOpen} handleClose={handleClose} />
    </>
  );
};

interface NewPasswordDialogProps {
  open: boolean;
  handleClose: () => void;
}

const NewPasswordDialog = ({open, handleClose}: NewPasswordDialogProps) => {
  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>
        We have reset your password. Please login with your new password.
      </DialogTitle>
    </Dialog>
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
  fontWeight: 600,
});

const PageContainer = styled(Box)(({theme}) => ({
  display: 'flex',
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: theme.palette.grey[100],
  padding: '2rem 0',
}));
