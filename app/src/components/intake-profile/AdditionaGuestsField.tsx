import {faker} from '@faker-js/faker';
import {Stack, Typography, Button, TextField} from '@mui/material';
import {FormikErrors, FormikHandlers, FieldArray} from 'formik';
import {InitialValues} from 'src/views/IntakeProfile';
import {Guest} from '../../services/profile';

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
  return (
    <Stack gap={2}>
      <FieldArray name={`${groupId}.${fieldId}`}>
        {({push, remove}) => (
          <>
            {guests.map((guest, index) => {
              return (
                <Stack key={guest.id} sx={{gap: 1}}>
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
                  />
                  <TextField
                    id="outlined"
                    placeholder="Guest date of birth"
                    variant="outlined"
                    label="Date of birth"
                    name={`${groupId}.${fieldId}[${index}].dob`}
                    value={guest.dob}
                    onChange={onChange}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    error={Boolean(errors[groupId]?.[fieldId]?.[index]?.dob)}
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
                  />
                </Stack>
              );
            })}
            <Button
              onClick={() =>
                push({
                  id: faker.string.uuid(),
                  name: '',
                  dob: '',
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
