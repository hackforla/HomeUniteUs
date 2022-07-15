import {Stack, Typography, OutlinedInput} from '@mui/material';

interface FormProps {
  handleChange: (e: React.ChangeEvent<unknown>) => void;
  value: string;
  touched: boolean | undefined;
  error: string | undefined;
}

export const PhoneForm = ({handleChange, value, touched, error}: FormProps) => {
  return (
    <Stack sx={{flexGrow: 1, gap: 1, maxWidth: '600px'}}>
      <Typography variant="h5">What is your phone number?</Typography>
      <OutlinedInput
        fullWidth
        id="phone"
        name="phone"
        value={value}
        onChange={handleChange}
        error={touched && Boolean(error)}
      />
    </Stack>
  );
};
