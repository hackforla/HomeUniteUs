import {Stack, Button, TextField, Typography} from '@mui/material';
import {FormikErrors, FieldArray} from 'formik';
import {Pet} from '../../services/profile';
import Autocomplete from '@mui/material/Autocomplete';

interface Values {
  pets: Pet[];
}

interface AdditionalPetsFieldProps {
  pets: Pet[];
  fieldId: string;
  groupId: string;
  errors: FormikErrors<Values>;
  setFieldValue: (
    field: string,
    value: string,
    shouldValidate?: boolean,
  ) => void;
}

const top10pets = [
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
  pets,
  fieldId,
  groupId,
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
                    options={top10pets}
                    getOptionLabel={option => option.label}
                    value={
                      top10pets.find(option => option.label === pet.type) ||
                      null
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
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        error={Boolean(
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
