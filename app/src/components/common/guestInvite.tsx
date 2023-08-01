import React, {useState} from 'react';
import {object, string} from 'yup';
import {useFormik} from 'formik';
import {
  Box,
  Button,
  TextField,
  FormHelperText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import {useInviteGuestMutation} from '../../services/coordinator';

const theme = createTheme({
  palette: {
    primary: {main: '#0057A1'},
  },
  typography: {
    button: {
      textTransform: 'none',
    },
  },
});

export const validationSchema = object({
  fullName: string().required('name is required'),
  email: string().email().required('email is required'),
});

export const GuestInviteButton = () => {
  const [open, setOpen] = useState(false);
  const [inviteGuest] = useInviteGuestMutation();
  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values: {fullName, email},
    touched,
    errors,
    isValid,
    dirty,
    resetForm,
  } = useFormik({
    initialValues: {
      fullName: '',
      email: '',
    },
    validationSchema,
    onSubmit: values => {
      setOpen(false);
      inviteGuest(values);
      resetForm();
    },
  });
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };
  return (
    <>
      <ThemeProvider theme={theme}>
        <Button
          variant="outlined"
          onClick={handleOpen}
          sx={{
            width: '100%',
            marginRight: '2em',
          }}
          color="primary"
        >
          <ControlPointIcon color="primary" />
          &nbsp;&nbsp;Invite Guest
        </Button>

        <form onSubmit={handleSubmit}>
          <Dialog
            open={open}
            onClose={handleClose}
            fullWidth={true}
            maxWidth={'xs'}
            disablePortal
          >
            <DialogTitle>Invite a Guest</DialogTitle>
            <DialogContent dividers>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <TextField
                  id="outlined-name-input"
                  label="Full Name"
                  type="FullName"
                  name="fullName"
                  value={fullName}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched.fullName && Boolean(errors.fullName)}
                />
                {touched.fullName && errors.fullName && (
                  <FormHelperText error>{errors.fullName}</FormHelperText>
                )}
                <TextField
                  id="outlined-email-input"
                  label="Email"
                  type="email"
                  name="email"
                  sx={{
                    marginTop: '1em',
                  }}
                  value={email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && Boolean(errors.email)}
                />
                {touched.email && errors.email && (
                  <FormHelperText error>{errors.email}</FormHelperText>
                )}
              </Box>
            </DialogContent>
            <DialogActions
              sx={{
                marginRight: '1em',
              }}
            >
              <Button variant="text" color="primary" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="contained"
                type="submit"
                color="primary"
                disabled={!isValid || !dirty}
              >
                Send Invite
              </Button>
            </DialogActions>
          </Dialog>
        </form>
      </ThemeProvider>
    </>
  );
};
