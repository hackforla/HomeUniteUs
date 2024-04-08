import {Button, Stack} from '@mui/material';
import {Link, Outlet, useParams} from 'react-router-dom';
import {Formik} from 'formik';

import {buildValidationSchema, createInitialValues} from './constants';
import {
  useGetProfileQuery,
  useGetAnswersQuery,
  Answer,
} from '../../services/profile';

export type Values = {
  [key: string]: Answer['value'];
};

export type InitialValues = Record<string, Values>;

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

  const validationSchema = buildValidationSchema(fieldGroups, groupId);
  const initalValues = createInitialValues(fieldGroups, answers);

  return (
    <Formik
      initialValues={initalValues}
      validationSchema={validationSchema}
      enableReinitialize={true}
      onSubmit={values => {
        const updateAnswers = Object.entries(values[groupId]).map(
          ([fieldId, value]) => {
            const answer = answers.find(answer => answer.fieldId === fieldId);
            if (answer) {
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
