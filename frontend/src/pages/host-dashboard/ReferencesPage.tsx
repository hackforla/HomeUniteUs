/* eslint-disable */
import {Box, Typography, Divider, TextField, Button} from '@mui/material';
import {styled} from '@mui/system';
import {useNavigate} from 'react-router-dom';
import {useState} from 'react';

export function ReferencesPage() {
  const navigate = useNavigate();

  // State for two references
  const [references, setReferences] = useState([
    {fullName: '', relationship: '', phone: '', email: ''},
    {fullName: '', relationship: '', phone: '', email: ''},
  ]);
  const [error, setError] = useState('');

  // Helper validation for email
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Handle change for reference inputs
  const handleReferenceChange = (
    index: number,
    field: keyof (typeof references)[0],
    value: string,
  ) => {
    const updatedReferences = [...references];
    updatedReferences[index] = {
      ...updatedReferences[index],
      [field]: value,
    };
    setReferences(updatedReferences);
  };

  const handleNextClick = () => {
    for (let i = 0; i < references.length; i++) {
      const ref = references[i];

      if (!ref.fullName.trim()) {
        setError(`Please enter full name for reference ${i + 1}.`);
        return;
      }
      if (!ref.relationship.trim()) {
        setError(`Please enter relationship for reference ${i + 1}.`);
        return;
      }
      if (!ref.phone.trim() || !/^\d+$/.test(ref.phone)) {
        setError(
          `Phone number for reference ${i + 1} must be at least 10 digits.`,
        );
        return;
      }
      if (!ref.email.trim() || !isValidEmail(ref.email)) {
        setError(`Please enter a valid email for reference ${i + 1}.`);
        return;
      }

      if (ref.phone.length < 10) {
        setError(
          `Phone number for reference ${i + 1} must be at least 10 digits.`,
        );
        return;
      }
    }

    if (references[0].phone === references[1].phone) {
      setError('Phone numbers for both references must be different.');
      return;
    }

    if (
      references[0].email.toLowerCase() === references[1].email.toLowerCase()
    ) {
      setError('Email addresses for both references must be different.');
      return;
    }
    setError('');
    navigate('/host/overview');
  };

  const handlePreviousClick = () => {
    navigate('/host/interests');
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
          References
        </Typography>

        <Typography variant="body1" paragraph>
          List 2 personal references who have known you for at least 1 year. A
          SPY staff member will reach out to these individuals to learn more
          about you.
        </Typography>

        <Divider sx={{my: 3}} />

        {references.map((ref, idx) => (
          <Box
            key={idx}
            sx={{mb: 4, p: 2, border: '1px solid #ccc', borderRadius: 2}}
          >
            <Typography variant="h6" sx={{mb: 2}}>
              Reference {idx + 1}
            </Typography>

            <TextField
              label="Full Name"
              value={ref.fullName}
              onChange={e =>
                handleReferenceChange(idx, 'fullName', e.target.value)
              }
              fullWidth
              sx={{mb: 2}}
            />

            <TextField
              label="Relationship"
              value={ref.relationship}
              onChange={e =>
                handleReferenceChange(idx, 'relationship', e.target.value)
              }
              fullWidth
              sx={{mb: 2}}
            />

            <TextField
              label="Phone Number"
              value={ref.phone}
              onChange={e => {
                const val = e.target.value;
                if (/^\d*$/.test(val)) {
                  handleReferenceChange(idx, 'phone', val);
                }
              }}
              fullWidth
              sx={{mb: 2}}
            />

            <TextField
              label="Email"
              value={ref.email}
              onChange={e =>
                handleReferenceChange(idx, 'email', e.target.value)
              }
              fullWidth
              sx={{mb: 2}}
              type="email"
            />
          </Box>
        ))}

        <Divider sx={{my: 3}} />

        {error && (
          <Typography variant="body2" color="error" sx={{mb: 2}}>
            {error}
          </Typography>
        )}

        <ButtonRow>
          <Button
            variant="outlined"
            onClick={handlePreviousClick}
            sx={{color: 'black', borderColor: 'black'}}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            onClick={handleNextClick}
            sx={{
              backgroundColor: 'black',
              color: 'white',
              '&:hover': {backgroundColor: '#333'},
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

const ButtonRow = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
});
