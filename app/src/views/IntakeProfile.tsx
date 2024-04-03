import {Button, Stack} from '@mui/material';
import {Link, Outlet, useParams} from 'react-router-dom';
import {Formik} from 'formik';
import {object} from 'yup';

import {
  FieldGroup,
  Answer,
  validations,
  FieldTypes,
} from './constants/intakeProfile';
import {useGetProfileQuery, useGetAnswersQuery} from '../services/profile';

export type Values = {
  [key: string]: unknown;
};

export type InitialValues = Record<string, Values>;

const fieldDefaultValue = (fieldType: FieldTypes) => {
  switch (fieldType) {
    case 'short_text':
      return '';
    case 'long_text':
      return '';
    case 'dropdown':
      return '';
    case 'number':
      return '';
    case 'additional_guests':
      return [];
    case 'email':
      return '';
    case 'multiple_choice':
      return '';
    case 'yes_no':
      return '';
    default:
      return '';
  }
};

/**
 * Creates an object used for the initial Formik valiues
 * It takes the form of:
 * {
 *  fieldGroupId: {
 *     fieldId: answerValue
 *  }
 * }
 */
const createInitialValues = (
  fieldGroups: FieldGroup[],
  answers: Answer[],
): InitialValues => {
  return fieldGroups.reduce((acc: InitialValues, fieldGroup) => {
    const fields = fieldGroup.fields.reduce((acc, field) => {
      return {
        ...acc,
        [field.id]:
          answers.find(answer => answer.fieldId === field.id)?.value ||
          fieldDefaultValue(field.type),
      };
    }, {});

    return {
      ...acc,
      [fieldGroup.id]: {...fields},
    };
  }, {});
};

/**
 * Creates a validation schema for Formik based on field type
 * It takes the form of:
 * {
 *  fieldGroupId: {
 *     fieldId: validationSchema
 *  }
 * }
 */

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

  // const {answers, fieldGroups} = useFieldGroups({profileId: profileId || ''});
  const {data: profileData} = useGetProfileQuery(
    {profileId: profileId},
    {skip: !profileId},
  );
  const {data: answersData} = useGetAnswersQuery({userId: '1'});

  if (
    profileId === undefined ||
    groupId === undefined ||
    profileData === undefined ||
    answersData === undefined
  )
    return null;

  const {fieldGroups} = profileData;
  const {answers} = answersData;
  console.log(answers);

  const validationSchema = buildValidationSchema(fieldGroups, groupId);
  const initalValues = createInitialValues(fieldGroups, answers);

  return (
    <Formik
      initialValues={initalValues}
      validationSchema={validationSchema}
      enableReinitialize={true}
      onSubmit={values => {
        // Update answers objects with new values
        const updateAnswers = Object.entries(values[groupId]).map(
          ([fieldId, value]) => {
            const answer = answers.find(answer => answer.fieldId === fieldId);
            if (answer) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              answer.value = value;
              return answer;
            } else {
              return {
                fieldId,
                value,
              };
            }
          },
        );

        window.alert(JSON.stringify(updateAnswers, null, 2));
      }}
    >
      {({errors, handleSubmit}) => (
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
          <Stack
            onSubmit={handleSubmit}
            component="form"
            sx={{height: '100%', flex: 1}}
          >
            <Stack sx={{flex: 1, overflowY: 'auto'}}>
              <Outlet context={{groupId, fieldGroups, errors}} />
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
