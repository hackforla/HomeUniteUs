import {Stack, OutlinedInput} from '@mui/material';
import {useFormikContext} from 'formik';
import {FormValues} from '../../../views/GuestApplicationTracker';
import {ApplicationFormLabel} from '../ApplicationFormLabel';

export const AddressForm = () => {
  const {
    values: {address},
    handleChange,
    touched,
    errors,
  } = useFormikContext<FormValues>();

  return (
    <Stack sx={{flexGrow: 1, gap: 1, maxWidth: '600px'}}>
      <ApplicationFormLabel htmlFor="address">
        What is your address?
      </ApplicationFormLabel>
      <OutlinedInput
        fullWidth
        id="address"
        name="address"
        value={address}
        onChange={handleChange}
        error={touched.address && Boolean(errors.address)}
      />
    </Stack>
  );
};
