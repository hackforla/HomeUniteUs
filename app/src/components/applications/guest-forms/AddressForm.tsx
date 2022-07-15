import {Stack, OutlinedInput} from '@mui/material';
import {ApplicationFormLabel} from '../ApplicationFormLabel';

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
      <ApplicationFormLabel htmlFor="address">
        What is your address?
      </ApplicationFormLabel>
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
