import {
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {useFormikContext} from 'formik';
import {formInputValues} from '../components/common/GuestApplicationContext';
import {FormContainer} from '../components/authentication';

export const Tester2 = () => {
  const {
    values: {email, phoneNumber, contactPrefrence},
    validateForm,
    setFieldTouched,
    handleChange,
    handleBlur,
    errors,
    touched,
  } = useFormikContext<formInputValues>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formErrors = await validateForm();
    if (formErrors.email) {
      setFieldTouched('email', true);
      return;
    }
  };

  return (
    <FormContainer>
      <Stack
        spacing={4}
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Typography variant="h4">Forgot Password</Typography>
        <Stack
          component="form"
          title="Forgot Password"
          sx={{width: '100%', alignItems: 'flex-start'}}
          onSubmit={handleSubmit}
          spacing={4}
        >
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            value={email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email && Boolean(errors.email)}
            helperText={touched.email && errors.email}
          />
          <TextField
            fullWidth
            id="phoneNumber"
            name="phoneNumber"
            label="Phone Number"
            value={phoneNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.phoneNumber && Boolean(errors.phoneNumber)}
            helperText={touched.phoneNumber && errors.phoneNumber}
          />
          <RadioGroup
            name="contactMethod"
            onChange={handleChange}
            onBlur={handleBlur}
            value={contactPrefrence}
          >
            <FormLabel>Contact Preference</FormLabel>
            <FormControlLabel value="phone" control={<Radio />} label="Phone" />
            <FormControlLabel value="email" control={<Radio />} label="Email" />
          </RadioGroup>
        </Stack>
      </Stack>
    </FormContainer>
  );
};
