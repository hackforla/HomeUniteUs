import {
  Container,
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
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {FormikErrors, useFormikContext, FormikHandlers} from 'formik';
import {useOutletContext} from 'react-router-dom';
import {Values, InitialValues} from 'src/views/IntakeProfile';
import {AdditionalGuestsField} from './AdditionaGuestsField';
import {FieldGroup, Fields, Guest, Pet} from 'src/services/profile';

import {AdditionalPetsField} from './AdditionalPetsField';

export interface OutletContext {
  groupId: string;
  fieldGroups: FieldGroup[];
}

export const FieldGroupList = () => {
  const {groupId, fieldGroups} = useOutletContext<OutletContext>();
  const {values, handleChange, errors, setFieldValue} =
    useFormikContext<InitialValues>();

  if (fieldGroups === undefined || groupId === undefined) return null;
  const fieldGroup = fieldGroups.find(group => group.id === groupId);
  const fields = fieldGroup?.fields || [];

  return (
    <Container maxWidth="sm" sx={{py: 4}}>
      <Stack
        sx={{
          gap: 2,
          '.MuiInputLabel-asterisk': {color: 'red'},
          '.MuiFormLabel-asterisk': {color: 'red'},
        }}
      >
        <Typography variant="h5">{fieldGroup?.title}</Typography>
        {fields.map(field => {
          return (
            <Stack key={field.id} sx={{gap: 1}}>
              <RenderFields
                groupId={groupId}
                field={field}
                values={values[groupId]}
                handleChange={handleChange}
                setFieldValue={setFieldValue}
                errors={errors}
              />
            </Stack>
          );
        })}
      </Stack>
    </Container>
  );
};

interface RenderFieldProps {
  groupId: string;
  field: Fields;
  values: Values;
  handleChange: FormikHandlers['handleChange'];
  errors: FormikErrors<InitialValues>;
}

export const RenderFields = ({
  groupId,
  field,
  values,
  handleChange,
  setFieldValue,
  errors,
}: RenderFieldProps) => {
  const props = {
    name: `${groupId}.${field.id}`,
    value: values[field.id],
    onChange: handleChange,
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const error = Boolean(errors[groupId]?.[field.id]);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const helperText = errors[groupId]?.[field.id];
  switch (field.type) {
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
          error={error}
          helperText={helperText}
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
          id="outlined"
          placeholder="(909)555-1234"
          variant="outlined"
          required={field.validations.required}
          InputLabelProps={{
            shrink: true,
          }}
        />
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
    case 'multiple_choice':
      return (
        <TextField
          {...props}
          id="outlined"
          placeholder="multiple choice field"
          variant="outlined"
        />
      );
    case 'additional_guests':
      return (
        <AdditionalGuestsField
          errors={errors}
          guests={values[field.id] as Guest[]}
          fieldId={field.id}
          groupId={groupId}
          onChange={handleChange}
        />
      );
    case 'pets':
      return (
        <AdditionalPetsField
          errors={errors}
          pets={values[field.id] as Pet[]}
          fieldId={field.id}
          groupId={groupId}
          setFieldValue={setFieldValue}
        />
      );
    default:
      throw new Error('Invalid field type');
  }
};
