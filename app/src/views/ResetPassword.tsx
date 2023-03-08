import {Button, Stack, TextField, Typography} from '@mui/material';
import {useFormikContext} from 'formik';
import {ResestPasswordValues} from '../components/authentication/ResetPasswordContext';
import {useResetPasswordMutation} from '../services/auth';

export const ResetPassword = () => {
  const {
    handleChange,
    values: {password, confirmPassword},
    touched,
    errors,
    handleSubmit,
  } = useFormikContext<ResestPasswordValues>();
  const [, {error, isError}] = useResetPasswordMutation({
    fixedCacheKey: 'reset-password-post',
  });
  console.log({error, isError});
  return (
    <Stack
      spacing={2}
      sx={{justifyContent: 'center', alignItems: 'flex-start', p: 4}}
    >
      <Typography variant="h4">Reset Password</Typography>
      <Stack
        component="form"
        spacing={2}
        sx={{minWidth: '350px', alignItems: 'flex-start'}}
        onSubmit={handleSubmit}
      >
        <TextField
          fullWidth
          label="Password"
          id="password"
          name="password"
          value={password}
          onChange={handleChange}
          error={touched.password && Boolean(errors.password)}
        />
        <TextField
          fullWidth
          label="Confirm password"
          id="confirmPassword"
          name="confirmPassword"
          value={confirmPassword}
          onChange={handleChange}
          error={touched.confirmPassword && Boolean(errors.confirmPassword)}
        />
        <Button variant="contained" size="large" type="submit">
          Submit
        </Button>
      </Stack>
    </Stack>
  );
};
