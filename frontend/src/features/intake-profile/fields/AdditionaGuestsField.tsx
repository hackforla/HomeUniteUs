import {faker} from '@faker-js/faker';
import {Stack, Typography, Button, TextField} from '@mui/material';
import {
  FormikErrors,
  FormikHandlers,
  FieldArray,
  useFormikContext,
} from 'formik';
import {InitialValues} from 'src/pages/intake-profile/IntakeProfile';
import {Guest} from '../../../services/profile';
import {DatePickerField} from './DatePickerField';

interface AdditionalGuestsFieldProps {
  errors: FormikErrors<InitialValues>;
  guests: Guest[];
  fieldId: string;
  groupId: string;
  onChange: FormikHandlers['handleChange'];
}

export const AdditionalGuestsField = ({
  errors,
  guests,
  fieldId,
  groupId,
  onChange,
}: AdditionalGuestsFieldProps) => {
  const {setFieldValue} = useFormikContext<InitialValues>();
  return (
    <Stack gap={2}>
      <FieldArray name={`${groupId}.${fieldId}`}>
        {({push, remove}) => (
          <>
            {guests.map((guest, index) => {
              return (
                <Stack key={guest.id} sx={{gap: 2}}>
                  <Stack direction="row" sx={{justifyContent: 'space-between'}}>
                    <Typography variant="h6">Guest {index + 1}</Typography>
                    <Button
                      color="inherit"
                      onClick={() => remove(index)}
                      variant="text"
                    >
                      X
                    </Button>
                  </Stack>
                  <TextField
                    id="outlined"
                    placeholder="Guest name"
                    variant="outlined"
                    label="Full name"
                    name={`${groupId}.${fieldId}[${index}].name`}
                    value={guest.name}
                    onChange={onChange}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    error={Boolean(errors[groupId]?.[fieldId]?.[index]?.name)}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    helperText={errors[groupId]?.[fieldId]?.[index]?.name}
                  />
                  <DatePickerField
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    error={errors[groupId]?.[fieldId]?.[index]?.dob}
                    name={`${groupId}.${fieldId}[${index}].dob`}
                    value={guest.dob}
                    handleChange={(name, value) => {
                      setFieldValue(name, value);
                    }}
                  />
                  <TextField
                    id="outlined"
                    placeholder="Guest relationship"
                    variant="outlined"
                    label="Relationship"
                    name={`${groupId}.${fieldId}[${index}].relationship`}
                    value={guest.relationship}
                    onChange={onChange}
                    error={Boolean(
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      errors[groupId]?.[fieldId]?.[index]?.relationship,
                    )}
                    helperText={
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      errors[groupId]?.[fieldId]?.[index]?.relationship
                    }
                  />
                </Stack>
              );
            })}
            <Button
              onClick={() =>
                push({
                  id: faker.string.uuid(),
                  name: '',
                  dob: null,
                  relationship: '',
                })
              }
              variant="text"
            >
              Add Guest
            </Button>
          </>
        )}
      </FieldArray>
    </Stack>
  );
};
