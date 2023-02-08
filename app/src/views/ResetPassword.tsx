import {
  Button,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';
import {useForgotPasswordMutation} from '../services/auth';

export const ResetPassword = () => {
  const [email, setEmail] = React.useState('');

  const [forgotPassword] = useForgotPasswordMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await forgotPassword({email}).unwrap();
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

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
        <Stack spacing={1} sx={{width: '100%'}}>
          <InputLabel htmlFor="email">Password</InputLabel>
          <OutlinedInput
            fullWidth
            id="password"
            name="password"
            value={email}
            onChange={handleChange}
            // error={touched.email && Boolean(errors.email)}
          />
          {/* {touched.email && errors.email && (
            <FormHelperText error>{errors.email}</FormHelperText>
          )} */}
        </Stack>
        <Stack spacing={1} sx={{width: '100%'}}>
          <InputLabel htmlFor="email">Confirm Password</InputLabel>
          <OutlinedInput
            fullWidth
            id="confirmPassword"
            name="comfirmPassword"
            value={email}
            onChange={handleChange}
            // error={touched.email && Boolean(errors.email)}
          />
          {/* {touched.email && errors.email && (
            <FormHelperText error>{errors.email}</FormHelperText>
          )} */}
        </Stack>
        <Stack spacing={1} sx={{width: '100%'}}>
          <InputLabel htmlFor="email">Code</InputLabel>
          <OutlinedInput
            fullWidth
            id="code"
            name="code"
            value={email}
            onChange={handleChange}
            // error={touched.email && Boolean(errors.email)}
          />
          {/* {touched.email && errors.email && (
            <FormHelperText error>{errors.email}</FormHelperText>
          )} */}
        </Stack>

        <Button variant="contained" size="large" type="submit">
          Submit
        </Button>
      </Stack>
    </Stack>
  );
};
