import {Stack, Button, TextField, Typography} from '@mui/material';
import {FormikErrors, FieldArray, useFormikContext} from 'formik';
import {Pet} from '../../../services/profile';
import Autocomplete from '@mui/material/Autocomplete';
import {InitialValues} from 'src/views/IntakeProfile';

interface Values {
  pets: Pet[];
}

interface AdditionalPetsFieldProps {
  pets: Pet[];
  fieldId: string;
  groupId: string;
  errors: FormikErrors<Values>;
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
  pets,
  fieldId,
  groupId,
}: AdditionalPetsFieldProps) => {
  const {setFieldValue} = useFormikContext<InitialValues>();

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
