import React from 'react';
import {Link, Navigate, useParams} from 'react-router-dom';
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
  useGetProfileQuery,
} from '../../services/profile';
import {createInitialValuesForSection, updateResponses} from './helpers';
import {RenderFields} from './RenderFields';
import {Loading} from '../ui';

const getNextSectionId = (fieldGroups: FieldGroup[], sectionId: string) => {
  const currentSectionIndex = fieldGroups.findIndex(
    group => group.id === sectionId,
  );

  if (currentSectionIndex === -1) {
    return '';
  }

  if (currentSectionIndex === fieldGroups.length - 1) {
    return '';
  }

  return fieldGroups[currentSectionIndex + 1].id;
};

export const ProfileSection = () => {
  const {profileId, sectionId} = useParams();
  const {data: profile, isFetching: fetchingProfile} = useGetProfileQuery({
    profileId: profileId,
  });
  const {data: section, isFetching: fetchingSection} =
    useGetProfileSectionQuery(
      {profileId: profileId, sectionId: sectionId},
      {refetchOnMountOrArgChange: true},
    );
  const {data: responses, isFetching: fetchingResponses} = useGetResponsesQuery(
    {
      userId: '1',
    },
  );

  if (fetchingSection || fetchingProfile || fetchingResponses)
    return <Loading />;

  if (!section || !responses || !profile || !sectionId) {
    return <Typography>Something went wrong</Typography>;
  }

  const nextSectionId = getNextSectionId(profile?.fieldGroups, sectionId);
  const initialValeus = createInitialValuesForSection(
    section,
    responses.responses,
  );

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
        to={`/guest/profile/${profileId}`}
        color="inherit"
        sx={{alignSelf: 'flex-start'}}
        startIcon={<ArrowBack />}
      >
        Go back
      </Button>
      <ProfileSectionFields
        section={section}
        responses={responses.responses}
        sectionId={sectionId}
        nextSectionId={nextSectionId}
        initialValues={initialValeus}
      />
    </Container>
  );
};

interface ProfileSectionFieldsProps {
  initialValues: InitialValues;
  nextSectionId: string;
  responses: Response[];
  section: FieldGroup;
  sectionId: string;
}

export type Values = {
  [key: string]: Response['value'];
};

export type InitialValues = Record<string, Values>;

const ProfileSectionFields = ({
  initialValues,
  nextSectionId,
  responses,
  section,
  sectionId,
}: ProfileSectionFieldsProps) => {
  const [saveResponses, {isSuccess, isError, error}] =
    useSaveResponsesMutation();

  const handleOnSubmit = async (values: InitialValues) => {
    if (!sectionId) {
      console.error('groupId is not defined in on submit');
      return;
    }
    // Update the responses with the new values or create new response objects
    const updatedResponses = updateResponses({responses, values, sectionId});

    await saveResponses({responses: updatedResponses});
  };

  if (isSuccess) {
    return <Navigate to={`/guest/profile/1/${nextSectionId}`} replace={true} />;
  }

  if (isError) {
    console.log('Error:', error);
  }

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      onSubmit={handleOnSubmit}
    >
      {({
        errors,
        handleChange,
        setFieldValue,
        values,
        handleSubmit,
        isSubmitting,
      }) => {
        return (
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
              <Button
                variant="contained"
                color="inherit"
                sx={{
                  width: 140,
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={isSubmitting}
                onClick={() => handleSubmit()}
                variant="contained"
                sx={{
                  width: 140,
                }}
                endIcon={
                  isSubmitting ? (
                    <CircularProgress sx={{mx: 1}} size={20} color="inherit" />
                  ) : null
                }
              >
                Save
              </Button>
            </Stack>
          </Stack>
        );
      }}
    </Formik>
  );
};
