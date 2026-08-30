import {useState} from 'react';
import {Navigate, useNavigate, useParams} from 'react-router-dom';
import {
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import {useAppDispatch} from '../../redux/hooks/store';
import {addCompletedSection} from './guetsProfileSlice';

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

  return `/${fieldGroups[currentSectionIndex + 1].id}`;
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
    return (
      <div>
        Something went wrong. We were not able to retrieve what you were looking
        for.
      </div>
    );
  }

  const nextSectionId = getNextSectionId(profile?.fieldGroups, sectionId);
  const initialValeus = createInitialValuesForSection(
    section,
    responses.responses,
  );

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        py: 6,
        gap: 6,
      }}
    >
      <ProfileSectionFields
        initialValues={initialValeus}
        nextSectionId={nextSectionId}
        responses={responses.responses}
        section={section}
        sectionId={sectionId}
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
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [saveResponses, {isSuccess, isError, error}] =
    useSaveResponsesMutation();

  const handleOnSubmit = async (values: InitialValues) => {
    if (!sectionId) {
      console.error('groupId is not defined in on submit');
      return;
    }
    // Update the responses with the new values or create new response objects
    const updatedResponses = updateResponses({responses, values, sectionId});

    await saveResponses({responses: updatedResponses})
      .then(() => {
        dispatch(addCompletedSection(sectionId));
      })
      .catch(() => {
        console.error('Error saving responses');
      });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNavigate = () => {
    navigate(`/guest/profile/1`);
  };

  if (isSuccess) {
    return <Navigate to={`/guest/profile/1${nextSectionId}`} replace={true} />;
    // return <Navigate to={`/guest/profile/1`} replace={true} />;
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
        handleSubmit,
        isSubmitting,
        setFieldValue,
        values,
        dirty,
      }) => {
        return (
          <>
            <Button
              color="inherit"
              // variant="outlined"
              startIcon={<ArrowBack />}
              sx={{alignSelf: 'flex-start'}}
              onClick={() => {
                if (dirty) {
                  handleOpen();
                  return;
                }

                handleNavigate();
              }}
            >
              Go back
            </Button>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">Unsaved changes</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  You have unsaved changes, leave anyway?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="inherit">
                  Cancel
                </Button>
                <Button onClick={handleNavigate} variant="contained" autoFocus>
                  Okay
                </Button>
              </DialogActions>
            </Dialog>
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
                        field={field}
                        groupId={sectionId}
                        handleChange={handleChange}
                        setFieldValue={setFieldValue}
                        values={values}
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
                  endIcon={
                    isSubmitting ? (
                      <CircularProgress
                        sx={{mx: 1}}
                        size={20}
                        color="inherit"
                      />
                    ) : null
                  }
                  onClick={() => handleSubmit()}
                  sx={{
                    width: 140,
                  }}
                  variant="contained"
                >
                  Save
                </Button>
              </Stack>
            </Stack>
          </>
        );
      }}
    </Formik>
  );
};
