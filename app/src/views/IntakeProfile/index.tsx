import {Button, Stack, useMediaQuery, useTheme} from '@mui/material';
import {Outlet, useParams} from 'react-router-dom';
import {Formik} from 'formik';
import {buildValidationSchema, createInitialValues} from './constants';
import {
  useGetProfileQuery,
  useGetResponsesQuery,
  Response,
} from '../../services/profile';
import {useState} from 'react';
import {ProfileSection} from '../../components/intake-profile/Sections';
export type Values = {
  [key: string]: Response['value'];
};

export type InitialValues = Record<string, Values>;

export const IntakeProfile = () => {
  const theme = useTheme();
  const toolbarHeight = Number(theme.mixins.toolbar.minHeight);
  const {profileId, groupId} = useParams();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showSections, setShowSections] = useState(isMobile);

  const {data: profileData} = useGetProfileQuery(
    {profileId: profileId},
    {skip: !profileId},
  );
  const {data: responsesData} = useGetResponsesQuery({userId: '1'});

  function handleClick() {
    setShowSections(!showSections);
  }

  if (
    profileId === undefined ||
    groupId === undefined ||
    profileData === undefined ||
    responsesData === undefined
  )
    return null;

  const {fieldGroups} = profileData;
  const {responses} = responsesData;

  const validationSchema = buildValidationSchema(fieldGroups, groupId);
  const initalValues = createInitialValues(fieldGroups, responses);

  return (
    <Formik
      initialValues={initalValues}
      validationSchema={validationSchema}
      enableReinitialize={true}
      onSubmit={values => {
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
            height: `calc(100vh - ${toolbarHeight}px)`,
            backgroundColor: 'grey.50',
          }}
        >
          <Stack
            sx={{
              gap: 1,
              width: '412px',
              overflowY: 'auto',
              borderRight: '1px solid',
              borderColor: 'grey.200',
              backgroundColor: 'inherit',
              padding: '12px',
              display: {xs: showSections ? 'flex' : 'none', md: 'flex'},
            }}
          >
            <ProfileSection
              fieldGroups={fieldGroups}
              handleClick={handleClick}
            />
          </Stack>
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
                onClick={() => alert('go back to prev item')}
                style={{border: '2px solid'}} //in styles to prevent bug where button becomes smaller on hover
                sx={{width: {sm: '100%', md: 183}}}
              >
                Back
              </Button>
              <Button
                size="medium"
                variant="contained"
                onClick={() => alert('continue to next item')}
                sx={{width: {sm: '100%', md: 183}}}
              >
                Continue
              </Button>
              <Button
                size="medium"
                variant="text"
                onClick={handleClick}
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
