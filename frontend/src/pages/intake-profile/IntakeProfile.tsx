import {Button, Stack, useMediaQuery, useTheme} from '@mui/material';
import {Outlet, useLocation, useNavigate, useParams} from 'react-router-dom';
import {Formik} from 'formik';
import {buildValidationSchema, createInitialValues} from './helpers';
import {
  useGetProfileQuery,
  useGetResponsesQuery,
  Response,
} from '../../services/profile';
import {useState} from 'react';
import {ProfileSidebar} from '../../features/intake-profile';
export type Values = {
  [key: string]: Response['value'];
};

export type InitialValues = Record<string, Values>;

export const IntakeProfile = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const {profileId, groupId} = useParams();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showSections, setShowSections] = useState(isMobile);
  const [selectedItem, setSelectedItem] = useState<string | null>(
    groupId || null,
  );

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
  const validationSchema =
    groupId === undefined ? {} : buildValidationSchema(fieldGroups, groupId);

  // create initial values from responses and fieldGroups
  const initalValues = createInitialValues(fieldGroups, responses);
  const currentIndex = fieldGroups.findIndex(
    group => group.id === selectedItem,
  );

  function toggleShowSections() {
    setShowSections(!showSections);
  }

  function handleNext() {
    if (currentIndex < fieldGroups.length - 1) {
      const nextGroupId = fieldGroups[currentIndex + 1].id;
      setSelectedItem(nextGroupId);
      navigate(`group/${nextGroupId}`);
      //need to add autosave feature
    }
  }

  function handleBack() {
    if (currentIndex > 0) {
      const prevGroupId = fieldGroups[currentIndex - 1].id;
      setSelectedItem(prevGroupId);
      navigate(`group/${prevGroupId}`);
      //need to add autosave feature
    }
  }

  const handleSubmitApplication = () => {
    // submit the application after review
  };

  return (
    <Formik
      initialValues={initalValues}
      validationSchema={validationSchema}
      enableReinitialize={true}
      onSubmit={values => {
        if (!groupId) {
          console.error('groupId is not defined in on submit');
          return;
        }

        const updateResponses = Object.entries(values[groupId]).map(
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

        window.alert(JSON.stringify(updateResponses, null, 2));
      }}
    >
      {({errors, handleSubmit}) => (
        <Stack
          direction="row"
          sx={{
            height: '100vh',
            backgroundColor: 'grey.50',
          }}
        >
          <ProfileSidebar
            fieldGroups={fieldGroups}
            groupId={groupId}
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
              <Outlet context={{groupId, fieldGroups, errors}} />
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
            </Stack>
          </Stack>
        </Stack>
      )}
    </Formik>
  );
};
