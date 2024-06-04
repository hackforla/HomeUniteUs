import {faker} from '@faker-js/faker';
import {Stack, Typography, Button, TextField} from '@mui/material';
import {DateField} from '@mui/x-date-pickers/DateField';
import {
  FormikErrors,
  FormikHandlers,
  FieldArray,
  useFormikContext,
} from 'formik';
import {InitialValues} from 'src/views/IntakeProfile';
import {Guest} from '../../services/profile';
import {format, isDate} from 'date-fns';

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
              // console.log('guest', guest);
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
                    helperText={errors[groupId]?.[fieldId]?.[index]?.name}
                  />
                  <DateField
                    label="Date of birth"
                    value={guest.dob}
                    format="P"
                    onChange={value => {
                      let date = value;
                      if (isDate(value) && value !== null) {
                        date = format(value, 'P');
                      }

                      setFieldValue(
                        `${groupId}.${fieldId}[${index}].dob`,
                        date,
                        true,
                      );
                    }}
                    slotProps={{
                      textField: {
                        error: Boolean(
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          errors[groupId]?.[fieldId]?.[index]?.dob,
                        ),
                        helperText: errors[groupId]?.[fieldId]?.[index]?.dob,
                      },
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
