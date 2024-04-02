import {Button, Stack} from '@mui/material';
import {Link, Outlet, useParams} from 'react-router-dom';
import {Formik} from 'formik';
import {object} from 'yup';

import {useFieldGroups} from './hooks/useFieldGroups';
import {FieldGroup, Answer, validations} from './constants/intakeProfile';

type Values = {
  [key: string]: unknown;
};

type InitialValues = Record<string, Values>;

const createInitialValues = (
  fieldGroups: FieldGroup[],
  answers: Answer[],
): InitialValues => {
  return fieldGroups.reduce((acc: InitialValues, fieldGroup) => {
    const fields = fieldGroup.fields.reduce((acc, field) => {
      return {
        ...acc,
        [field.id]:
          answers.find(answer => answer.fieldId === field.id)?.value || '',
      };
    }, {});

    return {
      ...acc,
      [fieldGroup.id]: {...fields},
    };
  }, {});
};

const buildValidationSchema = (
  fieldGroup: FieldGroup[],
  groupId: string | undefined,
) => {
  if (groupId === undefined) {
    console.error('Invalid groupId');
    return object().shape({});
  }

  const fields = fieldGroup.find(group => group.id === groupId)?.fields || [];

  const schema = object().shape(
    fields.reduce((acc, field) => {
      return {
        ...acc,
        [field.id]: validations[field.type],
      };
    }, {}),
  );

  return object().shape({
    [groupId]: object().shape({...schema.fields}),
  });
};

export const IntakeProfile = () => {
  const {profileId, groupId} = useParams();

  const {answers, fieldGroups} = useFieldGroups({profileId: profileId || ''});

  if (profileId === undefined || groupId === undefined) return null;

  const validationSchema = buildValidationSchema(fieldGroups, groupId);
  const initalValues = createInitialValues(fieldGroups, answers);

  return (
    <Formik
      initialValues={initalValues}
      validationSchema={validationSchema}
      enableReinitialize={true}
      onSubmit={values => {
        window.alert(values[groupId]);
      }}
    >
      {() => (
        <Stack
          direction="row"
          sx={{
            height: '100vh',
            width: '100vw',
            backgroundColor: 'grey.50',
          }}
        >
          <Stack
            sx={{
              gap: 1,
              p: 1,
              height: '100%',
              width: '256px',
              borderRight: '1px solid',
              borderColor: 'grey.200',
              backgroundColor: 'background.default',
            }}
          >
            {fieldGroups.map(({id, title}) => {
              const fieldTitle = title || '...';
              return (
                <Button
                  key={id}
                  variant="contained"
                  to={`group/${id}`}
                  component={Link}
                  color="inherit"
                >
                  {fieldTitle}
                </Button>
              );
            })}
          </Stack>
          <Stack component="form" sx={{height: '100%', flex: 1}}>
            <Stack sx={{flex: 1, overflowY: 'auto'}}>
              <Outlet context={{groupId, fieldGroups}} />
            </Stack>
            <Stack sx={{p: 1}}>
              <Button type="submit" variant="contained">
                Submit
              </Button>
            </Stack>
          </Stack>
        </Stack>
      )}
    </Formik>
  );
};
