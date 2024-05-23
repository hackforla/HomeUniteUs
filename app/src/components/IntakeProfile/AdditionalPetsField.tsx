// import {faker} from '@faker-js/faker';
import {Stack, Button, TextField} from '@mui/material';
// import {FormikErrors, FormikHandlers, FieldArray} from 'formik';
import {FieldArray} from 'formik';

import {Pet} from '../../services/profile';
import Autocomplete from '@mui/material/Autocomplete';

// interface Values {
//   pets: Pet[];
// }

interface AdditionalPetsFieldProps {
  pets: Pet[];
  // errors: FormikErrors<Values>;
  fieldId: string;
  // onChange: FormikHandlers['handleChange'];
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
  // errors,
  pets,
  fieldId,
  // onChange,
}: AdditionalPetsFieldProps) => {
  return (
    <Stack gap={2}>
      <FieldArray name={fieldId}>
        {({push /*remove*/}) => (
          <>
            {pets.map((pet, index) => {
              return (
                <Stack key={`pet-${index}`} sx={{gap: 1}}>
                  <Autocomplete
                    disablePortal
                    id="combo-box"
                    options={top10pets}
                    sx={{width: 300}}
                    renderInput={params => (
                      <TextField {...params} label="pet" />
                    )}
                  />
                </Stack>
              );
            })}
            <Button
              onClick={() =>
                push({
                  // type: faker.string.alpha(),
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
