import {Stack, Button, TextField, Typography} from '@mui/material';
import {FormikErrors, FieldArray} from 'formik';
import {Pet} from '../../../services/profile';
import Autocomplete from '@mui/material/Autocomplete';
import {InitialValues} from '../../../pages/intake-profile/IntakeProfile';

interface Values {
  pets: Pet[];
}

interface AdditionalPetsFieldProps {
  errors: FormikErrors<Values>;
  fieldId: string;
  groupId: string;
  pets: Pet[];
  setFieldValue: (
    field: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
    shouldValidate?: boolean,
  ) => Promise<void | FormikErrors<InitialValues>>;
}

const top_pets = [
  {label: 'Dog'},
  {label: 'Cat'},
  {label: 'Bird'},
  {label: 'Fish'},
  {label: 'Reptile'},
  {label: 'Hamster'},
  {label: 'Rabbit'},
];

export const AdditionalPetsField = ({
  errors,
  fieldId,
  groupId,
  pets,
  setFieldValue,
}: AdditionalPetsFieldProps) => {
  return (
    <Stack gap={2}>
      <FieldArray name={`${groupId}.${fieldId}`}>
        {({push, remove}) => (
          <>
            {pets.map((pet, index) => {
              return (
                <Stack key={`pet-${index}`} sx={{gap: 1}}>
                  <Stack direction="row" sx={{justifyContent: 'space-between'}}>
                    <Typography variant="h6">Pet {index + 1}</Typography>
                    <Button
                      color="inherit"
                      onClick={() => remove(index)}
                      variant="text"
                    >
                      X
                    </Button>
                  </Stack>
                  <Autocomplete
                    disablePortal
                    id={`combo-box-${index}`}
                    options={top_pets}
                    getOptionLabel={option => option.label}
                    value={
                      top_pets.find(option => option.label === pet.type) || null
                    }
                    sx={{width: '100%'}}
                    onChange={(event, value) => {
                      setFieldValue(
                        `${groupId}.${fieldId}[${index}].type`,
                        value?.label || '',
                      );
                    }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label="Pet Type"
                        error={Boolean(
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          errors[groupId]?.[fieldId]?.[index]?.type,
                        )}
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        helperText={errors[groupId]?.[fieldId]?.[index]?.type}
                      />
                    )}
                  />
                </Stack>
              );
            })}
            <Button
              onClick={() =>
                push({
                  type: '',
                })
              }
              variant="text"
            >
              Add Pet
            </Button>
          </>
        )}
      </FieldArray>
    </Stack>
  );
};
