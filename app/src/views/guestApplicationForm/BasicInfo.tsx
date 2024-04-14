import {Stack, TextField, Typography, MenuItem} from '@mui/material';
import React from 'react';
import {FormContainer} from '../../components/authentication';
import {formInputValues} from '../../components/common/GuestApplicationContext';
import {useFormikContext} from 'formik';

export const BasicInfo = () => {
  const {
    values: {fullName, dateOfBirth, gender},
    handleChange,
    handleBlur,
    errors,
    touched,
    validateForm,
    setFieldTouched,
  } = useFormikContext<formInputValues>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formErrors = await validateForm();
    if (formErrors.fullName) {
      setFieldTouched('fullName', true);
      return;
    }
  };

  const genders = [
    'Woman',
    'Man',
    'Transgender',
    'Non-Binary / Non-Conforming',
  ];

  return (
    <FormContainer>
      <Stack
        spacing={4}
        sx={{justifyContent: 'center', alignItems: 'left', width: '100%'}}
      >
        <Typography variant="h5" sx={{fontWeight: 'bold'}}>
          Basic Information
        </Typography>

        <Stack
          component="form"
          title="Basic Info Page"
          sx={{width: '100%', alignItems: 'flex-start'}}
          spacing={4}
          onSubmit={handleSubmit}
        >
          <TextField
            fullWidth
            name="fullName"
            label="Full Name"
            value={fullName}
            placeholder="name"
            id="name"
            type="text"
            onChange={handleChange}
            onBlur={handleBlur}
            InputLabelProps={{
              shrink: true,
            }}
            error={touched.fullName && Boolean(errors.fullName)}
            helperText={touched.fullName && errors.fullName}
          />

          <TextField
            fullWidth
            label="Date of Birth"
            value={dateOfBirth}
            name="dateOfBirth"
            placeholder="mm/dd/yyyy"
            id="dateofbirth"
            type="text"
            onChange={handleChange}
            onBlur={handleBlur}
            InputLabelProps={{
              shrink: true,
            }}
            error={touched.dateOfBirth && Boolean(errors.dateOfBirth)}
            helperText={touched.dateOfBirth && errors.dateOfBirth}
          />

          <TextField
            fullWidth
            label="Gender Identity"
            value={gender}
            name="gender"
            id="gender"
            defaultValue="Select"
            select
            onChange={handleChange}
            onBlur={handleBlur}
            InputLabelProps={{
              shrink: true,
            }}
            error={touched.gender && Boolean(errors.gender)}
            helperText={touched.gender && errors.gender}
          >
            {genders.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </Stack>
    </FormContainer>
  );
};
