import {useFormik} from 'formik';
import React from 'react';
import {object, string} from 'yup';
import {
  TextField,
  Stack,
  Typography,
  Alert,
  Button,
  CircularProgress,
} from '@mui/material';
import {FormContainer} from '../authentication/FormContainer';
import {getErrorMessage} from '../../app/helpers';
import {useInviteUserMutation} from '../../services/auth';

export interface InviteUserValues {
  email: string;
}

const validationSchema = object({
  email: string().email('invalid email').required('email is required'),
});

const initialValues = {
  email: '',
};

export const InviteUserForm = () => {
  const {
    handleSubmit,
    handleChange,
    values: {email},
    touched,
    errors,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, {resetForm}) => {
      try {
        await inviteUser(values).unwrap();
        resetForm();
      } catch (err) {
        console.log({err});
      }
    },
  });

  // add isSuccess to conditionally-render success popup/message
  const [inviteUser, {error, isError, isLoading}] = useInviteUserMutation();

  return (
    <FormContainer>
      <Stack spacing={4} sx={{justifyContent: 'center', alignItems: 'center'}}>
        {isError ? (
          <Alert sx={{width: '100%'}} severity="error">
            {getErrorMessage(error)}
          </Alert>
        ) : null}
        <Typography variant="h4">Type Email Address</Typography>
        <Stack
          component="form"
          spacing={4}
          sx={{width: '100%', alignItems: 'flex-start'}}
          onSubmit={handleSubmit}
        >
          <TextField
            fullWidth
            label="Guest email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            error={touched.email && Boolean(errors.email)}
            helperText={touched.email && errors.email}
          />
          <Button
            disabled={isLoading}
            fullWidth
            variant="contained"
            size="large"
            type="submit"
          >
            Send Verification Code
            {isLoading ? (
              <CircularProgress sx={{mx: 1}} size={20} color="inherit" />
            ) : null}
          </Button>
        </Stack>
      </Stack>
    </FormContainer>
  );
};
