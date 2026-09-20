/* eslint-disable */
import {
  Box,
  Typography,
  Divider,
  Button,
  styled,
  IconButton,
} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {useState} from 'react';
import CloseIcon from '@mui/icons-material/Close';

export default function AddPhotos() {
  const navigate = useNavigate();

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [additionalPhotos, setAdditionalPhotos] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhoto(file);
    }
  };

  const handleAdditionalUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length + additionalPhotos.length > 4) {
      setError('You can upload up to 4 additional photos.');
      return;
    }
    setAdditionalPhotos([...additionalPhotos, ...files]);
  };

  const removeAdditionalPhoto = (index: number) => {
    const updated = [...additionalPhotos];
    updated.splice(index, 1);
    setAdditionalPhotos(updated);
  };

  const handleNext = () => {
    setError(null);

    if (!profilePhoto) {
      setError('Please upload a profile photo.');
      return;
    }

    if (additionalPhotos.length > 4) {
      setError('You can only upload up to 4 additional photos.');
      return;
    }

    navigate('/host/overview');
  };

  return (
    <PageContainer>
      <Header>
        <Typography
          variant="body2"
          sx={{cursor: 'pointer'}}
          onClick={() => navigate('/host/')}
        >
          &lt; Back to Dashboard
        </Typography>
      </Header>

      <ContentContainer>
        <Typography
          variant="body2"
          sx={{
            cursor: 'pointer',
            color: 'primary.main',
            mb: 2,
            fontWeight: 500,
          }}
          onClick={() => navigate('/host/overview')}
        >
          &lt; My Profile Overview
        </Typography>

        <Typography variant="h4" gutterBottom sx={{fontWeight: 'bold'}}>
          Add Some Photos
        </Typography>

        <Typography variant="body1" paragraph>
          Help us recognize you. Your profile photos allow us to know it’s you.
        </Typography>

        <Divider sx={{my: 3}} />

        <Typography variant="body1" paragraph>
          Max file size is 5 MB. Only .jpg files are supported. Up to 4
          additional photos can be added.
        </Typography>

        {/* Upload Section */}
        <UploadSection>
          {/* Profile Photo Column */}
          <Box sx={{flex: 1, mr: 2}}>
            <Typography variant="subtitle1" sx={{fontWeight: 'bold', mb: 1}}>
              Upload Profile Photo
            </Typography>
            <UploadBox
              onClick={() => document.getElementById('profileUpload')?.click()}
            >
              <Circle>
                <Plus>+</Plus>
              </Circle>
              <input
                type="file"
                id="profileUpload"
                accept="image/*"
                style={{display: 'none'}}
                onChange={handleProfileUpload}
              />
            </UploadBox>
            {profilePhoto && (
              <PreviewRow>
                <Typography variant="body2">{profilePhoto.name}</Typography>
                <IconButton onClick={() => setProfilePhoto(null)} size="small">
                  <CloseIcon fontSize="small" />
                </IconButton>
              </PreviewRow>
            )}
          </Box>

          {/* Additional Photos Column */}
          <Box sx={{flex: 1, ml: 2}}>
            <Typography variant="subtitle1" sx={{fontWeight: 'bold', mb: 1}}>
              Additional Photos
            </Typography>
            <UploadBox
              onClick={() =>
                document.getElementById('additionalUpload')?.click()
              }
            >
              <Circle>
                <Plus>+</Plus>
              </Circle>
              <input
                type="file"
                id="additionalUpload"
                accept="image/*"
                multiple
                style={{display: 'none'}}
                onChange={handleAdditionalUpload}
              />
            </UploadBox>
            {additionalPhotos.map((file, index) => (
              <PreviewRow key={index}>
                <Typography variant="body2">{file.name}</Typography>
                <IconButton
                  onClick={() => removeAdditionalPhoto(index)}
                  size="small"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </PreviewRow>
            ))}
          </Box>
        </UploadSection>

        {error && <Typography sx={{color: 'red', mb: 2}}>{error}</Typography>}

        <Divider sx={{my: 3}} />

        <ButtonRow>
          <Button
            variant="outlined"
            onClick={() => navigate('/host/basic')}
            sx={{color: 'black', borderColor: 'black'}}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            sx={{
              backgroundColor: 'black',
              color: 'white',
              '&:hover': {
                backgroundColor: '#333',
              },
            }}
          >
            Next
          </Button>
        </ButtonRow>
      </ContentContainer>
    </PageContainer>
  );
}

// Styled Components
const PageContainer = styled(Box)({
  backgroundColor: '#fafafa',
  minHeight: '100vh',
});

const Header = styled(Box)(({theme}) => ({
  padding: theme.spacing(2, 4),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

const ContentContainer = styled(Box)(({theme}) => ({
  maxWidth: '50%',
  margin: '80px auto 0 auto',
  padding: theme.spacing(4),
  backgroundColor: '#fff',
  borderRadius: theme.spacing(2),
  textAlign: 'left',
}));

const UploadSection = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: 16,
  marginBottom: 32,
});

const UploadBox = styled(Box)({
  height: 180,
  border: '2px dashed #ccc',
  borderRadius: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  position: 'relative',
});

const Circle = styled(Box)({
  width: 48,
  height: 48,
  borderRadius: '50%',
  backgroundColor: 'black',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const Plus = styled('span')({
  color: 'white',
  fontSize: 24,
  lineHeight: 1,
});

const ButtonRow = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
});

const PreviewRow = styled(Box)({
  marginTop: 8,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});
