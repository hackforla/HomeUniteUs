import {useState} from 'react';
import {object, string} from 'yup';
import {useFormik} from 'formik';
import {
  Stack,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import {useInviteGuestMutation} from '../../services/coordinator';
import {CheckOutlined, EmailOutlined} from '@mui/icons-material';
import {isFetchBaseQueryError, isErrorWithMessage} from '../../app/helpers';

export const validationSchema = object({
  firstName: string().required('first name is required'),
  lastName: string().required('last name is required'),
  email: string().email().required('email is required'),
});

export const GuestInviteButton = () => {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [inviteGuest, {isLoading, isSuccess, reset}] = useInviteGuestMutation();
  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values: {firstName, lastName, email},
    touched,
    errors,
    resetForm,
  } = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
    validationSchema,
    onSubmit: values => {
      inviteGuest(values)
        .unwrap()
        .then(() => {
          setErrorMessage(null);
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
    },
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setErrorMessage(null);
    resetForm();
    reset();
  };

  return (
    <>
      <Button
        variant="contained"
        size="large"
        onClick={handleOpen}
        color="primary"
      >
        Invite New Guest
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        maxWidth="xs"
        disablePortal
      >
        {isSuccess ? (
          <SuccessMessage handleClose={handleClose} />
        ) : (
          <>
            <DialogTitle>Invite a Guest</DialogTitle>
            <DialogContent dividers>
              <Stack
                direction="column"
                sx={{gap: 2}}
                component="form"
                id="guest-invite-form"
                onSubmit={handleSubmit}
              >
                {errorMessage ? (
                  <Alert severity="error">{errorMessage}</Alert>
                ) : null}
                <TextField
                  id="first-name-input"
                  label="First Name"
                  name="firstName"
                  value={firstName}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched.firstName && Boolean(errors.firstName)}
                  helperText={touched.firstName && errors.firstName}
                />
                <TextField
                  id="last-name-input"
                  label="Last Name"
                  name="lastName"
                  value={lastName}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched.lastName && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                />
                <TextField
                  id="email-input"
                  label="Email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
              </Stack>
            </DialogContent>
            <DialogActions
              sx={{
                marginRight: 2,
              }}
            >
              <Button variant="text" color="inherit" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                form="guest-invite-form"
                variant="contained"
                type="submit"
                color="primary"
                disabled={isLoading}
              >
                Send Invite
                {isLoading ? (
                  <CircularProgress sx={{mx: 1}} size={20} color="inherit" />
                ) : null}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

interface SuccessMessageProps {
  handleClose: () => void;
}

const SuccessMessage = ({handleClose}: SuccessMessageProps) => {
  return (
    <Stack sx={{padding: '24px'}} justifyContent="center" alignItems="center">
      <Box sx={{position: 'relative'}}>
        <Box
          sx={{
            position: 'absolute',
            right: 0,
            top: 0,
            backgroundColor: 'success.main',
            borderRadius: 50,
            height: 24,
            width: 24,
          }}
        >
          <CheckOutlined sx={{color: 'primary.contrastText'}} />
        </Box>
        <EmailOutlined
          sx={{width: '84px', height: '84px', color: 'text.secondary'}}
        />
      </Box>
      <Typography
        textAlign="center"
        variant="h3"
        fontSize="32px"
        fontWeight="600"
      >
        Your invite has been sent!
      </Typography>
      <Typography textAlign="center" color="text.secondary">
        An invitation has been sent to the email provided.
      </Typography>
      <Button
        onClick={handleClose}
        sx={{mt: '24px'}}
        variant="contained"
        size="large"
      >
        Done
      </Button>
    </Stack>
  );
};
