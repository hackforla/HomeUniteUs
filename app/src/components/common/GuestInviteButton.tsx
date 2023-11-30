import {useState} from 'react';
import {object, string} from 'yup';
import {useFormik} from 'formik';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import {useInviteGuestMutation} from '../../services/coordinator';

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
          <Box
            component="form"
            onSubmit={handleSubmit}
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
              helperText={errors.fullName}
            />
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
              helperText={errors.email}
            />
          </Box>
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
            variant="contained"
            type="submit"
            color="primary"
            disabled={!isValid || !dirty}
          >
            Send Invite
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};