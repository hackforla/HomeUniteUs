import {Button, Stack, Typography, useTheme} from '@mui/material';
import {Link, Outlet, useParams} from 'react-router-dom';
import {Formik} from 'formik';

import {buildValidationSchema, createInitialValues} from './constants';
import {
  useGetProfileQuery,
  useGetResponsesQuery,
  Response,
} from '../../services/profile';

export type Values = {
  [key: string]: Response['value'];
};

export type InitialValues = Record<string, Values>;

export const IntakeProfile = () => {
  const theme = useTheme();
  const toolbarHeight = Number(theme.mixins.toolbar.minHeight);
  const {profileId, groupId} = useParams();

  const {data: profileData} = useGetProfileQuery(
    {profileId: profileId},
    {skip: !profileId},
  );
  const {data: responsesData} = useGetResponsesQuery({userId: '1'});

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
              p: 1,
              height: '100%',
              width: '412px',
              borderRight: '1px solid',
              borderColor: 'grey.200',
              backgroundColor: 'inherit',
              padding: '12px',
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
                0 of 11
              </Typography>
            </Stack>
            {fieldGroups.map(({id, title}) => {
              const fieldTitle = title || '...';
              return (
                <Button
                  key={id}
                  to={`group/${id}`}
                  component={Link}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: '#ffffff',
                    height: 56,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingInline: 3,
                  }}
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
                  {/*                 {complete ? (
                  <CheckCircleOutlined color="success" />
                ) : (
                  <CircleOutlined color="action" />
                )} */}
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
