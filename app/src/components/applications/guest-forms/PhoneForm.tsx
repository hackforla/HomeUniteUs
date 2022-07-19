import {Stack, OutlinedInput} from '@mui/material';
import {useFormikContext} from 'formik';
import {FormValues} from '../../../views/GuestApplicationTracker';
import {ApplicationFormLabel} from '../ApplicationFormLabel';

export const PhoneForm = () => {
  const {
    values: {phone},
    handleChange,
    touched,
    errors,
  } = useFormikContext<FormValues>();

  return (
    <Stack sx={{flexGrow: 1, gap: 1, maxWidth: '600px'}}>
      <ApplicationFormLabel htmlFor="phone">
        What is your phone number?
      </ApplicationFormLabel>
      <OutlinedInput
        fullWidth
        id="phone"
        name="phone"
        value={phone}
        onChange={handleChange}
        error={touched.phone && Boolean(errors.phone)}
      />
    </Stack>
  );
};
