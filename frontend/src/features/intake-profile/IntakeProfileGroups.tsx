import {Stack, Typography} from '@mui/material';
import {useFormikContext} from 'formik';
import {useOutletContext} from 'react-router-dom';

import {InitialValues} from 'src/pages/intake-profile/IntakeProfile';
import {RenderFields} from './RenderFields';
import {FieldGroup} from 'src/services/profile';

export interface OutletContext {
  groupId: string;
  fieldGroups: FieldGroup[];
}

export const FieldGroupList = () => {
  const {groupId, fieldGroups} = useOutletContext<OutletContext>();
  const {errors, handleChange, setFieldValue, values} =
    useFormikContext<InitialValues>();

  if (fieldGroups === undefined || groupId === undefined) return null;
  const fieldGroup = fieldGroups.find(group => group.id === groupId);
  const fields = fieldGroup?.fields || [];

  return (
    <Stack
      sx={{
        gap: 2,
        bgcolor: 'background.paper',
        padding: 4,
        borderRadius: 1,
        '.MuiInputLabel-asterisk': {color: 'red'},
        '.MuiFormLabel-asterisk': {color: 'red'},
      }}
    >
      <Typography variant="h5">{fieldGroup?.title}</Typography>
      {fields.map(field => {
        return (
          <Stack key={field.id} sx={{gap: 1}}>
            <RenderFields
              errors={errors}
              handleChange={handleChange}
              setFieldValue={setFieldValue}
              values={values}
              groupId={groupId}
              field={field}
            />
          </Stack>
        );
      })}
    </Stack>
  );
};
