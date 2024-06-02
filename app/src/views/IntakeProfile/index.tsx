import {Box, Stack, Typography, useMediaQuery, useTheme} from '@mui/material';
import {CheckCircleOutlined, LockRounded} from '@mui/icons-material';
import {FormButton} from '../../components/common/FormButton';
import {Link, Outlet, useParams} from 'react-router-dom';
import {Formik} from 'formik';

import {buildValidationSchema, createInitialValues} from './constants';
import {
  useGetProfileQuery,
  useGetResponsesQuery,
  Response,
} from '../../services/profile';
import {useEffect, useState} from 'react';

export type Values = {
  [key: string]: Response['value'];
};

export type InitialValues = Record<string, Values>;

export const IntakeProfile = () => {
  const theme = useTheme();
  const toolbarHeight = Number(theme.mixins.toolbar.minHeight);
  const {profileId, groupId} = useParams();
  const [completedCount, setCompletedCount] = useState(0);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showSections, setShowSections] = useState(isMobile);
  // use ismobile on mobile view of buttons?

  const {data: profileData} = useGetProfileQuery(
    {profileId: profileId},
    {skip: !profileId},
  );
  const {data: responsesData} = useGetResponsesQuery({userId: '1'});

  useEffect(() => {
    if (profileData) {
      const count = profileData.fieldGroups.filter(
        group => group.status == 'complete',
      ).length;
      setCompletedCount(count);
    }
  }, [profileData]);
  function handleClick() {
    setShowSections(!showSections);
    console.log(showSections);
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
  const totalTask = fieldGroups.length - 1;

  const statusStyling = {
    selected: {
      icon: null,
      color: theme.palette.primary.contrastText,
      borderColor: '#DADADA',
      shadow: '0px 4px 4px rgba(0, 0, 0, .25)',
    },
    complete: {
      icon: <CheckCircleOutlined color="success" />,
      color: '#EAF2EA',
      borderColor: 'grey.50',
      shadow: 'grey.50',
    },
    incomplete: {
      icon: null,
      color: theme.palette.primary.contrastText,
      borderColor: 'grey.50',
      shadow: 'grey.50',
    },
    locked: {
      icon: <LockRounded fontSize="small" sx={{color: 'rgba(0, 0, 0, .54)'}} />,
      color: '#E8E8E8',
      borderColor: 'grey.50',
      shadow: 'grey.50',
    },
  };
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
              p: 1,
              height: '100%',
              width: '412px',
              borderRight: '1px solid',
              borderColor: 'grey.200',
              backgroundColor: 'inherit',
              padding: '12px',
              display: {xs: showSections ? 'flex' : 'none', md: 'flex'},
            }}
          >
            <Stack
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '35px',
              }}
            >
              <Typography
                sx={{fontSize: 18, fontWeight: 'medium', marginBottom: 1}}
              >
                Profile Sections
              </Typography>
              <Typography sx={{fontSize: 14, fontWeight: 'medium'}}>
                {completedCount} of {totalTask}
              </Typography>
            </Stack>
            {fieldGroups.map(({id, title, status}) => {
              const fieldTitle = title || '...';
              return (
                <Box
                  key={id}
                  to={`group/${id}`}
                  component={Link}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: statusStyling[status].color,
                    height: 56,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingInline: 3,
                    borderColor: statusStyling[status].borderColor,
                    borderWidth: 2,
                    borderStyle: 'solid',
                    boxShadow: statusStyling[status].shadow,
                    textDecoration: 'none',
                  }}
                  onClick={handleClick}
                >
                  <Typography
                    sx={{
                      fontSize: 16,
                      fontWeight: 'medium',
                      color: theme.palette.text.primary,
                    }}
                  >
                    {fieldTitle}
                  </Typography>
                  {statusStyling[status].icon}
                </Box>
              );
            })}
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
            {isMobile ? (
              <Stack sx={{flexDirection: 'column', gap: 1, p: 2}}>
                <FormButton
                  text="Back"
                  variant="outline"
                  onClick={() => console.log('hello outline')}
                  mobile={true}
                />
                <FormButton
                  text="Continue"
                  variant="fill"
                  onClick={() => console.log('hello fill')}
                  mobile={true}
                />
                <FormButton
                  text="Return to Profile Sections"
                  variant="transparent"
                  onClick={handleClick}
                  mobile={true}
                />
              </Stack>
            ) : (
              <Stack
                sx={{flexDirection: 'row', marginLeft: 'auto', gap: 1, p: 2}}
              >
                <FormButton
                  text="Back"
                  variant="outline"
                  onClick={() => console.log('hello outline')}
                  mobile={false}
                />
                <FormButton
                  text="Continue"
                  variant="fill"
                  onClick={() => console.log('hello fill')}
                  mobile={false}
                />
              </Stack>
            )}
          </Stack>
        </Stack>
      )}
    </Formik>
  );
};
