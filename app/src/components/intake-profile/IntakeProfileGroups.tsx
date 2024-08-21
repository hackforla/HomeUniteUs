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
import {useFormikContext} from 'formik';
import {useOutletContext} from 'react-router-dom';
import {InitialValues} from 'src/views/IntakeProfile';
import {AdditionalGuestsField} from './fields/AdditionaGuestsField';
import {FieldGroup, Fields, Guest, Pet} from 'src/services/profile';

import {AdditionalPetsField} from './fields/AdditionalPetsField';
import {DatePickerField} from './fields/DatePickerField';

export interface OutletContext {
  groupId: string;
  fieldGroups: FieldGroup[];
}

export const FieldGroupList = () => {
  const {groupId, fieldGroups} = useOutletContext<OutletContext>();

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
              <RenderFields groupId={groupId} field={field} />
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
}

export const RenderFields = ({groupId, field}: RenderFieldProps) => {
  const {errors, handleChange, setFieldValue, values} =
    useFormikContext<InitialValues>();
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
          pets={props.value as Pet[]}
          fieldId={field.id}
          groupId={groupId}
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
          error={error}
          helperText={helperText}
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
    default:
      throw new Error('Invalid field type');
  }
};
