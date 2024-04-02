import {
  Container,
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {useOutletContext} from 'react-router-dom';
import {FieldGroup, Fields} from 'src/views/constants/intakeProfile';

interface OutletContext {
  groupId: string;
  fieldGroups: FieldGroup[];
}

export const FieldGroupList = () => {
  const {groupId, fieldGroups} = useOutletContext<OutletContext>();
  // const {values, handleChange, errors} = useFormikContext<InitialValues>();

  if (fieldGroups === undefined || groupId === undefined) return null;

  const fields = fieldGroups.find(group => group.id === groupId)?.fields || [];

  return (
    <Container maxWidth="sm" sx={{py: 4}}>
      <Stack sx={{gap: 2}}>
        {fields.map(field => {
          return (
            <Stack key={field.id} sx={{gap: 1}}>
              <Typography variant="h5">{field.title}</Typography>
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
  const props = {
    name: `${groupId}.${field.id}`,
  };

  switch (field.type) {
    case 'short_text':
      return (
        <TextField
          {...props}
          multiline
          rows={2}
          id="outlined"
          variant="outlined"
          placeholder="Type you answer here"
          // error={error}
          // helperText={helperText}
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
          variant="outlined"
          // error={error}
          // helperText={helperText}
        />
      );
    case 'number':
      return (
        <TextField
          label="Phone Number"
          {...props}
          // error={error}
          // helperText={helperText}
          id="outlined"
          placeholder="(909)555-1234"
          variant="outlined"
        />
      );
    case 'email':
      return (
        <TextField
          {...props}
          label="Email"
          // error={error}
          // helperText={helperText}
          id="outlined"
          placeholder="example@emai.com"
          variant="outlined"
        />
      );
    case 'yes_no':
      return (
        <FormControl>
          <RadioGroup {...props} row aria-labelledby="yes-no-field">
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
      );
    case 'dropdown':
      if (field.properties.choices === undefined)
        throw new Error('Invalid field type');

      return (
        <FormControl fullWidth>
          <Select
            {...props}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            displayEmpty
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
    default:
      throw new Error('Invalid field type');
  }
};
