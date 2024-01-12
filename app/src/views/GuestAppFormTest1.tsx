import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {useFormikContext} from 'formik';
import {
  formInputValues,
  /* stepContext, */
} from '../components/common/GuestApplicationContext';
import {FormContainer} from '../components/authentication';

export const Tester1 = () => {
  const {
    values: {fullName, dateOfBirth, gender},
    handleChange,
    handleBlur,
    errors,
    touched,
  } = useFormikContext<formInputValues>();

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
          /* onSubmit={handleSubmit} */
          spacing={4}
        >
          <TextField
            fullWidth
            id="fullName"
            name="fullName"
            label="Full Name"
            value={fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.fullName && Boolean(errors.fullName)}
            helperText={touched.fullName && errors.fullName}
          />
          <TextField
            fullWidth
            id="dateOfBirth"
            name="dateOfBirth"
            label="Date Of Birth"
            value={dateOfBirth}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.dateOfBirth && Boolean(errors.dateOfBirth)}
            helperText={touched.dateOfBirth && errors.dateOfBirth}
          />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Gender</InputLabel>
            <Select
              labelId="gender"
              id="gender"
              name="gender"
              value={gender}
              label="gender"
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.gender && Boolean(errors.gender)}
              renderValue={value => `${value}`}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={'male'}>Male</MenuItem>
              <MenuItem value={'female'}>Female</MenuItem>
              <MenuItem value={'other'}>Other</MenuItem>
            </Select>
          </FormControl>

          <Stack gap={2} width={'100%'}></Stack>
        </Stack>
      </Stack>
    </FormContainer>
  );
};
