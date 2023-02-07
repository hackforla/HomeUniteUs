import {
  Button,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';

export const ResetPassword = () => {
  const [email, setEmail] = React.useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(email);
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
          <InputLabel htmlFor="email">Email address</InputLabel>
          <OutlinedInput
            fullWidth
            id="email"
            name="email"
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
