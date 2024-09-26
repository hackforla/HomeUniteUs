import React from 'react';
import {useParams} from 'react-router-dom';
import {
  Button,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import {Formik} from 'formik';

import {
  FieldGroup,
  Response,
  useGetProfileSectionQuery,
  useGetResponsesQuery,
} from '../../services/profile';
import {createInitialValuesForSection} from './helpers';
import {RenderFields} from './RenderFields';

export const ProfileSection = () => {
  const {profileId, sectionId} = useParams();
  const {data: section, isLoading} = useGetProfileSectionQuery(
    {profileId: profileId, sectionId: sectionId},
    {skip: !profileId || !sectionId},
  );
  const {data: responses, isLoading: responsesLoading} = useGetResponsesQuery({
    userId: '1',
  });

  if (
    isLoading ||
    responsesLoading ||
    section === undefined ||
    responses === undefined
  )
    return <CircularProgress />;

  return (
    <Container sx={{display: 'flex', height: '100vh', py: 6}} maxWidth="sm">
      <ProfileSectionFields
        section={section}
        responses={responses.responses}
        sectionId={sectionId ?? ''}
      />
    </Container>
  );
};

interface ProfileSectionFieldsProps {
  section: FieldGroup;
  responses: Response[];
  sectionId: string;
}

const ProfileSectionFields = ({
  section,
  responses,
  sectionId,
}: ProfileSectionFieldsProps) => {
  return (
    <Formik
      enableReinitialize={true}
      initialValues={createInitialValuesForSection(section, responses)}
      onSubmit={values => {
        console.log(values);
      }}
    >
      {({errors, handleChange, setFieldValue, values}) => (
        <Stack sx={{gap: 4, flex: 1}}>
          <Typography variant="h5" sx={{color: 'primary.main'}}>
            {section?.title}
          </Typography>
          <Stack sx={{gap: 3}}>
            {section?.fields.map(field => {
              return (
                <Stack key={field.id}>
                  <RenderFields
                    errors={errors}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    values={values}
                    groupId={sectionId}
                    field={field}
                  />
                </Stack>
              );
            })}
          </Stack>
          <Stack
            sx={{flexDirection: 'row', justifyContent: 'flex-end', gap: 1}}
          >
            <Button variant="contained" color="inherit">
              Cancel
            </Button>
            <Button variant="contained">Save</Button>
          </Stack>
        </Stack>
      )}
    </Formik>
  );
};
