/* eslint-disable */
import {Box, Button, Divider, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {styled} from '@mui/system';

export function WelcomePage() {
  const navigate = useNavigate();

  return (
    <PageContainer>
      {/* Header with Back */}
      <Header>
        <Typography
          variant="body2"
          sx={{cursor: 'pointer'}}
          onClick={() => navigate('/host/')}
        >
          &lt; Back to Dashboard
        </Typography>
      </Header>

      {/* Centered Content */}
      <ContentContainer>
        <Typography
          variant="h4"
          gutterBottom
          sx={{textAlign: 'left', fontWeight: 'bold'}}
        >
          Welcome
        </Typography>
        <Typography variant="body1" paragraph sx={{textAlign: 'left'}}>
          Thank you for your interest in being a host! The next steps will
          create your profile.
        </Typography>
        <Typography variant="body1" paragraph sx={{textAlign: 'left'}}>
          You’ll need to provide details about your background, accommodations,
          contact information, potential constraints on housing and hosts, and
          pet information. Upon completion, a Home Unite Us coordinator will be
          in contact to review your profile.
        </Typography>
        <Divider sx={{width: '100%', my: 4}} />
        <ButtonWrapper>
          <Button
            variant="contained"
            onClick={() => navigate('/host/contact')}
            sx={{
              backgroundColor: 'black',
              '&:hover': {
                backgroundColor: '#333',
              },
            }}
          >
            Let’s Get Started
          </Button>
        </ButtonWrapper>
      </ContentContainer>
    </PageContainer>
  );
}

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

const ButtonWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
});
