import React from 'react';
import {Link, useParams} from 'react-router-dom';
import {
  Button,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import {ArrowBack} from '@mui/icons-material';
import {Formik} from 'formik';

import {
  FieldGroup,
  Response,
  useGetProfileSectionQuery,
  useGetResponsesQuery,
  useSaveResponsesMutation,
} from '../../services/profile';
import {createInitialValuesForSection} from './helpers';
import {RenderFields} from './RenderFields';
import {Loading} from '../ui';

export const ProfileSection = () => {
  const {profileId, sectionId} = useParams();
  const {data: section, isLoading} = useGetProfileSectionQuery(
    {profileId: profileId, sectionId: sectionId},
    {skip: !profileId || !sectionId},
  );
  const {data: responses, isLoading: responsesLoading} = useGetResponsesQuery({
    userId: '1',
  });

  if (isLoading || responsesLoading) return <Loading />;

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        py: 6,
        gap: 6,
      }}
      maxWidth="sm"
    >
      <Button
        component={Link}
        to={`/guest/profile-proto/${profileId}`}
        color="inherit"
        sx={{alignSelf: 'flex-start'}}
        startIcon={<ArrowBack />}
      >
        Go back
      </Button>
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

export type Values = {
  [key: string]: Response['value'];
};

export type InitialValues = Record<string, Values>;

const ProfileSectionFields = ({
  section,
  responses,
  sectionId,
}: ProfileSectionFieldsProps) => {
  const [saveResponses, {isLoading}] = useSaveResponsesMutation();

  const handleOnSubmit = (values: InitialValues) => {
    if (!sectionId) {
      console.error('groupId is not defined in on submit');
      return;
    }
    // Update the responses with the new values or create new response objects
    const updateResponses = Object.entries(values[sectionId]).map(
      ([fieldId, value]) => {
        const response = responses.find(
          response => response.fieldId === fieldId,
        );
        if (response) {
          response.value = value;
          return response;
        } else {
          return {
            fieldId,
            value,
          };
        }
      },
    );

    saveResponses({responses: updateResponses});
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={createInitialValuesForSection(section, responses)}
      onSubmit={handleOnSubmit}
    >
      {({errors, handleChange, setFieldValue, values, handleSubmit}) => (
        <Stack sx={{gap: 4, flex: 1, backgroundColor: 'white'}}>
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
            <Button
              disabled={isLoading}
              onClick={() => handleSubmit()}
              variant="contained"
            >
              Save
              {isLoading ? (
                <CircularProgress sx={{mx: 1}} size={20} color="inherit" />
              ) : null}
            </Button>
          </Stack>
        </Stack>
      )}
    </Formik>
  );
};
