import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from '@mui/material';
import {FormikHandlers, FormikErrors} from 'formik';

import {InitialValues} from 'src/pages/intake-profile/IntakeProfile';
import {AdditionalGuestsField} from './fields/AdditionaGuestsField';
import {Fields, Guest, Pet} from 'src/services/profile';
import {AdditionalPetsField} from './fields/AdditionalPetsField';
import {phoneRegExp} from './helpers';
import {DatePickerField} from './fields/DatePickerField';

interface RenderFieldProps {
  errors: FormikErrors<InitialValues>;
  handleChange: FormikHandlers['handleChange'];
  field: Fields;
  groupId: string;
  setFieldValue: (
    field: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
    shouldValidate?: boolean,
  ) => Promise<void | FormikErrors<InitialValues>>;
  values: InitialValues;
}

export const RenderFields = ({
  errors,
  handleChange,
  setFieldValue,
  values,
  groupId,
  field,
}: RenderFieldProps) => {
  const groupValues = values[groupId];

  const props = {
    name: `${groupId}.${field.id}`,
    value: groupValues[field.id],
    onChange: handleChange,
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const error = Boolean(errors[groupId]?.[field.id]);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const helperText = errors[groupId]?.[field.id];

  switch (field.type) {
    case 'additional_guests':
      return (
        <AdditionalGuestsField
          errors={errors}
          guests={groupValues[field.id] as Guest[]}
          fieldId={field.id}
          groupId={groupId}
          onChange={handleChange}
          setFieldValue={setFieldValue}
        />
      );
    case 'date':
      return (
        <DatePickerField
          name={props.name}
          value={props.value as string | null}
          error={errors[groupId]?.[field.id]}
          handleChange={(name, value) => {
            setFieldValue(name, value);
          }}
        />
      );
    case 'dropdown':
      if (field.properties.choices === undefined)
        throw new Error('Invalid field type');

      return (
        <FormControl fullWidth error={error} variant="outlined">
          <InputLabel
            shrink
            required={field.validations.required}
            id="demo-simple-select-label"
          >
            Select a choice
          </InputLabel>
          <Select
            {...props}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            displayEmpty
            input={<OutlinedInput label="Select a choice" />}
            inputProps={{'aria-label': 'select-choice'}}
          >
            <MenuItem value="" disabled>
              Select a choice
            </MenuItem>
            {field.properties.choices.map(choice => (
              <MenuItem key={choice.id} value={choice.label}>
                {choice.label}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{helperText}</FormHelperText>
        </FormControl>
      );
    case 'email':
      return (
        <TextField
          {...props}
          label={field.title}
          error={error}
          helperText={helperText}
          id="outlined"
          placeholder="example@emai.com"
          variant="outlined"
          required={field.validations.required}
          InputLabelProps={{
            shrink: true,
          }}
        />
      );
    case 'long_text':
      return (
        <TextField
          {...props}
          multiline
          rows={4}
          id="outlined"
          placeholder="Type you answer here"
          label={field.title}
          variant="outlined"
          error={error}
          helperText={helperText}
          required={field.validations.required}
          InputLabelProps={{
            shrink: true,
          }}
        />
      );
    case 'number':
      return (
        <TextField
          label={field.title}
          {...props}
          error={error}
          helperText={helperText}
          type="tel"
          id="outlined"
          placeholder="(909)555-1234"
          variant="outlined"
          required={field.validations.required}
          InputLabelProps={{
            shrink: true,
          }}
        />
      );
    case 'pets':
      return (
        <AdditionalPetsField
          errors={errors}
          fieldId={field.id}
          groupId={groupId}
          pets={props.value as Pet[]}
          setFieldValue={setFieldValue}
        />
      );
    case 'short_text':
      return (
        <TextField
          {...props}
          required={field.validations.required}
          multiline
          rows={1}
          id="outlined"
          variant="outlined"
          placeholder="Type you answer here"
          label={field.title}
          type="email"
          error={error}
          helperText={helperText}
          InputLabelProps={{
            shrink: true,
          }}
        />
      );
    case 'contact_method':
      // eslint-disable-next-line no-case-declarations
      const {emailFieldId, phoneFieldId} = field.linkedFields;
      // eslint-disable-next-line no-case-declarations
      let isEmailFilled = false;
      // eslint-disable-next-line no-case-declarations
      let isPhoneFilled = false;
      if (emailFieldId) {
        // This isn't best practice and can be replaced with validator library to verify email
        isEmailFilled = Boolean(
          values[emailFieldId] && /\S+@\S+\.\S+/.test(values[emailFieldId]),
        );
      }
      // eslint-disable-next-line no-case-declarations
      if (phoneFieldId) {
        isPhoneFilled = phoneRegExp.test(values[phoneFieldId]);
      }

      return (
        <FormControl error={error} required={field.validations.required}>
          <FormLabel sx={{color: 'black'}}>{field.title}</FormLabel>
          <RadioGroup {...props} aria-labelledby="contact-method-field">
            <FormControlLabel
              value="phone"
              control={<Radio />}
              label="Phone"
              disabled={!isPhoneFilled}
            />
            <FormControlLabel
              value="email"
              control={<Radio />}
              label="Email"
              disabled={!isEmailFilled}
            />
          </RadioGroup>
          <FormHelperText>{helperText}</FormHelperText>
        </FormControl>
      );

    case 'yes_no':
      return (
        <FormControl error={error} required={field.validations.required}>
          <FormLabel sx={{color: 'black'}}>{field.title}</FormLabel>
          <RadioGroup {...props} row aria-labelledby="yes-no-field">
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>
          <FormHelperText>{helperText}</FormHelperText>
        </FormControl>
      );
    default:
      throw new Error('Invalid field type');
  }
};
