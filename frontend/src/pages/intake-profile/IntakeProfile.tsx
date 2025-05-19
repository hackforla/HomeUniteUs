import React, {useState, useEffect} from 'react';
import {
  Button,
  Stack,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Typography,
} from '@mui/material';
import {Container, Stack, useMediaQuery, useTheme} from '@mui/material';
import {Outlet, useLocation, useNavigate, useParams} from 'react-router-dom';
import {Formik} from 'formik';
import {buildValidationSchema, createInitialValues} from './helpers';
import {useGetProfileQuery, Response} from '../../services/profile';
import {ProfileSidebar} from '../../features/intake-profile';

import {useState} from 'react';
import {createInitialValues} from '../../features/intake-profile/helpers';
import {
  useGetProfileQuery,
  useGetResponsesQuery,
  Response,
} from '../../services/profile';
import {ProfileActions, ProfileSidebar} from '../../features/intake-profile';
export type Values = {
  [key: string]: Response['value'];
};

export type InitialValues = Record<string, Values>;

export const IntakeProfile = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const toolbarHeight = Number(theme.mixins.toolbar.minHeight);
  const params = useParams();
  const {profileId, groupId} = useParams();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showSections, setShowSections] = useState(isMobile);
  const [selectedItem, setSelectedItem] = useState<string | null>(
    params.groupId || null,
  );

  // Debug logging for all parameters
  useEffect(() => {
    console.log('FULL ROUTE PARAMETERS:', params);
    console.log('CURRENT LOCATION:', location);
  }, [params, location]);

  // Determine profile type with extensive fallback
  const profileType =
    params.profileType || params.profileId?.split('-')[0] || 'guest';

  // const userId =
  //   params.userId ||
  //   (params.profileId?.split('-')[1]) ||
  //   'anonymous';

  // Fetch profile data
  const {
    data: profileData,
    isLoading: isProfileLoading,
    error: profileError,
  } = useGetProfileQuery({
    profileId: profileType,
  });

  // Extensive error logging
  useEffect(() => {
    if (profileError) {
      console.error('PROFILE FETCH ERROR:', profileError);
    }
  }, [profileError]);

  // Loading state
  if (isProfileLoading) {
    return (
      <Stack justifyContent="center" alignItems="center" sx={{height: '100vh'}}>
        <CircularProgress />
      </Stack>
    );
  }

  // Error handling
  if (profileError) {
    return (
      <Stack
        justifyContent="center"
        alignItems="center"
        sx={{height: '100vh', color: 'error.main'}}
      >
        <Typography variant="h6">
          Error loading profile. Please try again.
        </Typography>
        <Typography variant="body2">{JSON.stringify(profileError)}</Typography>
      </Stack>
    );
  }

  // If no data after loading, return null or show error
  if (!profileData) {
    return (
      <Stack
        justifyContent="center"
        alignItems="center"
        sx={{height: '100vh', color: 'error.main'}}
      >
        <Typography variant="h6">No profile data found</Typography>
      </Stack>
    );
  }

  const {form, responses = []} = profileData;
  const fieldGroups = form?.fieldGroups || [];

  // create validation schema for current group
  const validationSchema =
    params.groupId === undefined
      ? {}
      : buildValidationSchema(fieldGroups, params.groupId);
  const {data: profileData} = useGetProfileQuery(
    {profileId: profileId},
    {skip: !profileId},
  );
  const {data: responsesData} = useGetResponsesQuery({userId: '1'});

  if (
    profileId === undefined ||
    profileData === undefined ||
    responsesData === undefined
  )
    return null;

  const {fieldGroups} = profileData;
  const {responses} = responsesData;

  // create validation schema for current group. Return empty object if groupId is undefined, which means we are on welcome or review page
  // TODO: Reimplement validation schema generation
  // const validationSchema =
  //   groupId === undefined ? {} : buildValidationSchema(fieldGroups, groupId);

  // create initial values from responses and fieldGroups
  const initialValues = createInitialValues(fieldGroups, responses);

  const initalValues = createInitialValues(fieldGroups, responses);

  const currentIndex = fieldGroups.findIndex(
    group => group.id === selectedItem,
  );

  // Navigation and section management functions
  function toggleShowSections() {
    setShowSections(!showSections);
  }

  function handleNext() {
    if (currentIndex < fieldGroups.length - 1) {
      const nextGroupId = fieldGroups[currentIndex + 1].id;
      setSelectedItem(nextGroupId);
      navigate(`group/${nextGroupId}`);
    }
  }

  function handleBack() {
    if (currentIndex > 0) {
      const prevGroupId = fieldGroups[currentIndex - 1].id;
      setSelectedItem(prevGroupId);
      navigate(`group/${prevGroupId}`);
    }
  }

  const handleSubmitApplication = () => {
    // TODO: Implement application submission logic
    console.log('Submitting application');
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      initialValues={initalValues}
      // validationSchema={validationSchema}
      enableReinitialize={true}
      onSubmit={values => {
        if (!params.groupId) {
          console.error('groupId is not defined in on submit');
          return;
        }

        const updateResponses = Object.entries(values[params.groupId]).map(
          ([fieldId, value]) => {
            const response = responses.find(
              response => response.fieldId === fieldId,
            );
            if (response) {
              return {
                ...response,
                value,
              };
            } else {
              return {
                fieldId,
                value,
              };
            }
          },
        );

        window.alert(JSON.stringify(updateResponses, null, 2));
      }}
    >
      {({errors, handleSubmit}) => (
        <Stack
          sx={{
            flexDirection: 'row',
            height: '100vh',
            backgroundColor: 'grey.50',
            overflowY: 'scroll',
          }}
        >
          <ProfileSidebar
            fieldGroups={fieldGroups}
            groupId={params.groupId}
            isReviewPage={location.pathname.includes('review')}
            toggleShowSections={toggleShowSections}
            setSelectedItem={setSelectedItem}
            showSections={showSections}
          />
          <Stack
            onSubmit={handleSubmit}
            component="form"
            sx={{
              height: '100%',
              flex: 1,
              display: {xs: showSections ? 'none' : 'flex', md: 'flex'},
            }}
          >
            <Stack sx={{overflowY: 'auto'}}>
              <Outlet
                context={{groupId: params.groupId, fieldGroups, errors}}
              />
            </Stack>
            <Stack
              sx={{
                flexDirection: {xs: 'column', md: 'row'},
                marginLeft: {xs: '0', md: 'auto'},
                gap: 1,
                p: 2,
              }}
            >
              <Button
                size="medium"
                variant="outlined"
                onClick={handleBack}
                style={{border: '2px solid'}} //in styles to prevent bug where button becomes smaller on hover
                sx={{width: {sm: '100%', md: 161}}}
              >
                Back
              </Button>
              {location.pathname.includes('review') ? (
                <Button
                  size="medium"
                  variant="contained"
                  onClick={handleSubmitApplication}
                  sx={{width: {sm: '100%', md: 183}}}
                >
                  Submit Application
                </Button>
              ) : (
                <Button
                  size="medium"
                  variant="contained"
                  onClick={handleNext}
                  sx={{width: {sm: '100%', md: 183}}}
                >
                  Continue
                </Button>
              )}

              <Button
                size="medium"
                variant="text"
                onClick={toggleShowSections}
                sx={{
                  border: 2,
                  width: {sm: '100%'},
                  display: {md: 'none'},
                  color: 'black',
                  borderColor: 'transparent',
                }}
              >
                Return to Profile Sections
              </Button>
          <Container sx={{height: '100%'}} maxWidth="md">
            <Stack
              onSubmit={handleSubmit}
              component="form"
              sx={{
                flex: 1,
                my: 4,
                display: {xs: showSections ? 'none' : 'flex', md: 'flex'},
              }}
            >
              <Stack sx={{overflowY: 'auto'}}>
                <Outlet context={{groupId, fieldGroups, errors}} />
              </Stack>
              <ProfileActions
                handleBack={handleBack}
                handleNext={handleNext}
                handleSubmitApplication={handleSubmitApplication}
                toggleShowSections={toggleShowSections}
              />
            </Stack>
          </Container>
        </Stack>
      )}
    </Formik>
  );
};
