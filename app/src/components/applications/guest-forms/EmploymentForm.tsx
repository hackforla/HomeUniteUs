import {
  FormControlLabel,
  FormHelperText,
  OutlinedInput,
  Radio,
  RadioGroup,
  Stack,
} from '@mui/material';
import {useFormikContext} from 'formik';
import {FormValues} from '../../../views/GuestApplicationTracker';
import {ApplicationFormLabel} from '../ApplicationFormLabel';

export const EmploymentForm = () => {
  const {
    values: {isEmployed, employmentDescription},
    touched,
    errors,
    setFieldValue,
    handleChange,
  } = useFormikContext<FormValues>();

  return (
    <Stack sx={{flexGrow: 1, gap: 2, maxWidth: '600px'}}>
      <ApplicationFormLabel htmlFor="isEmployed">
        Are you currently employed?
      </ApplicationFormLabel>
      <Stack sx={{gap: 1}}>
        <RadioGroup
          aria-labelledby="isEmployed"
          name="isEmployed"
          value={isEmployed}
          onChange={e => {
            setFieldValue(
              'isEmployed',
              e.target.value === 'true' ? true : false,
            );
          }}
        >
          <FormControlLabel value={true} control={<Radio />} label="Yes" />
          <FormControlLabel value={false} control={<Radio />} label="No" />
        </RadioGroup>
        {touched.isEmployed && errors.isEmployed && (
          <FormHelperText error>{errors.isEmployed}</FormHelperText>
        )}
      </Stack>
      {isEmployed ? (
        <Stack spacing={1}>
          <ApplicationFormLabel htmlFor="employmentDescription">
            Please describe your employment status
          </ApplicationFormLabel>
          <OutlinedInput
            fullWidth
            id="employmentDescription"
            name="employmentDescription"
            type="employmentDescription"
            multiline
            value={employmentDescription}
            onChange={handleChange}
            error={
              touched.employmentDescription &&
              Boolean(errors.employmentDescription)
            }
          />
          {touched.employmentDescription && errors.employmentDescription && (
            <FormHelperText error>
              {errors.employmentDescription}
            </FormHelperText>
          )}
        </Stack>
      ) : null}
    </Stack>
  );
};
