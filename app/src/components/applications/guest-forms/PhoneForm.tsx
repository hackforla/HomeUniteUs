import {Stack, OutlinedInput} from '@mui/material';
import {ApplicationFormLabel} from '../ApplicationFormLabel';

interface FormProps {
  handleChange: (e: React.ChangeEvent<unknown>) => void;
  value: string;
  touched: boolean | undefined;
  error: string | undefined;
}

export const PhoneForm = ({handleChange, value, touched, error}: FormProps) => {
  return (
    <Stack sx={{flexGrow: 1, gap: 1, maxWidth: '600px'}}>
      <ApplicationFormLabel htmlFor="phone">
        What is your phone number?
      </ApplicationFormLabel>
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
