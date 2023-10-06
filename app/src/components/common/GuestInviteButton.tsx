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
} from '@mui/material';
import {useInviteGuestMutation} from '../../services/coordinator';

export const validationSchema = object({
  firstName: string().required('first name is required'),
  lastName: string().required('last name is required'),
  email: string().email().required('email is required'),
});

export const GuestInviteButton = () => {
  const [open, setOpen] = useState(false);

  const [inviteGuest] = useInviteGuestMutation();
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
        <DialogTitle>Invite a Guest</DialogTitle>
        <DialogContent dividers>
          <Stack
            direction="column"
            sx={{gap: 2}}
            component="form"
            id="guest-invite-form"
            onSubmit={handleSubmit}
          >
            <TextField
              id="first-name-input"
              label="First Name"
              name="firstName"
              value={firstName}
              onBlur={handleBlur}
              onChange={handleChange}
              error={touched.firstName && Boolean(errors.firstName)}
              helperText={errors.firstName}
            />
            <TextField
              id="last-name-input"
              label="Last Name"
              name="lastName"
              value={lastName}
              onBlur={handleBlur}
              onChange={handleChange}
              error={touched.lastName && Boolean(errors.lastName)}
              helperText={errors.lastName}
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
              helperText={errors.email}
            />
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{
            marginRight: '1em',
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
          >
            Send Invite
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
