import {Stack, Typography, OutlinedInput} from '@mui/material';

interface FormProps {
  handleChange: (e: React.ChangeEvent<unknown>) => void;
  value: string;
  touched: boolean | undefined;
  error: string | undefined;
}

export const AddressForm = ({
  handleChange,
  value,
  touched,
  error,
}: FormProps) => {
  return (
    <Stack sx={{flexGrow: 1, gap: 1, maxWidth: '600px'}}>
      <Typography variant="h5">What is your address?</Typography>
      <OutlinedInput
        fullWidth
        id="address"
        name="address"
        value={value}
        onChange={handleChange}
        error={touched && Boolean(error)}
      />
    </Stack>
  );
};
