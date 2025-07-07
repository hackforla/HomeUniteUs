/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function ProfileOverview() {
  const navigate = useNavigate();
  const [completionStatus, setCompletionStatus] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    async function fetchStatus() {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user?.id ?? 1;

        const res = await axios.get(`/api/host-dashboard/completion-status/${userId}`);
        setCompletionStatus(res.data);
      } catch (err) {
        console.error('Error fetching completion status:', err);
      }
    }
    fetchStatus();
  }, []);

  const buttons = [
    { label: 'Contact Information', to: '/host/contact' },
    { label: 'Basic Information', to: '/host/basic' },
    { label: 'Photos', to: '/host/photos' },
    { label: 'Housing', to: '/host/housing' },
    { label: 'Employment', to: '/host/employment' },
    { label: 'Interests and Hobbies', to: '/host/interests' },
    { label: 'References', to: '/host/references' },
    { label: 'Background', to: '/host/background' },
    { label: 'Interest in Being a Host', to: '/host/motives' },
    { label: 'Preferences in a Guest', to: '/host/preferences' },
    { label: 'Strengths and Challenges', to: '/host/eval' },
    { label: 'About Me', to: '/host/me' },
  ];

  // Icons for completion status
  const CompleteIcon = () => (
    <Box
      sx={{
        width: 24,
        height: 24,
        borderRadius: '50%',
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 1,
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="green"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </Box>
  );

  const PartialIcon = () => (
    <Box
      sx={{
        width: 24,
        height: 24,
        borderRadius: '50%',
        background: 'linear-gradient(90deg, white 50%, transparent 50%)',
        border: '2px solid white',
        marginLeft: 1,
      }}
    />
  );

  const IncompleteIcon = () => (
    <Box
      sx={{
        width: 24,
        height: 24,
        borderRadius: '50%',
        border: '2px solid white',
        marginLeft: 1,
      }}
    />
  );

  return (
    <PageContainer>
      <Header>
        <Typography
          variant="body2"
          sx={{ cursor: 'pointer' }}
          onClick={() => navigate('/host/')}
        >
          &lt; Back to Dashboard
        </Typography>
      </Header>

      <IntroText>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Profile Overview
        </Typography>
        <Typography variant="body1">We want to get to know you better</Typography>
      </IntroText>

      <ContentArea>
        <ProfileImage
          src="https://via.placeholder.com/400x400.png?text=Profile+Image"
          alt="Profile overview"
        />

        <ButtonsContainer>
          {buttons.map(({ label, to }) => {
            const status = completionStatus[label];
            let icon = null;
            if (status === 'complete') {
              icon = <CompleteIcon />;
            } else if (status === 'partial') {
              icon = <PartialIcon />;
            } else if (status === 'incomplete') {
              icon = <IncompleteIcon />;
            }

            return (
              <RoundedButton
                key={label}
                onClick={() => navigate(to)}
                variant="outlined"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: 1.5,
                  paddingLeft: 2,
                }}
              >
                {icon}
                {label}
              </RoundedButton>
            );
          })}

          <SquareGreyButton onClick={() => navigate('/some/other/path')}>
            Review Profile
          </SquareGreyButton>
        </ButtonsContainer>
      </ContentArea>
    </PageContainer>
  );
}

// Styled components

const PageContainer = styled(Box)({
  backgroundColor: '#fafafa',
  minHeight: '100vh',
  padding: '20px 40px',
});

const Header = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 4),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

const IntroText = styled(Box)({
  textAlign: 'center',
  maxWidth: 600,
  margin: '40px auto 60px auto',
});

const ContentArea = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  gap: 40,
  flexWrap: 'wrap',
});

const ProfileImage = styled('img')({
  width: 400,
  height: 400,
  borderRadius: 8,
  objectFit: 'cover',
});

const ButtonsContainer = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: 12,
  overflowY: 'auto',
});

const RoundedButton = styled(Button)({
  backgroundColor: '#505050',
  borderRadius: 50,
  color: 'white',
  textTransform: 'none',
  padding: '10px 24px',
  fontWeight: 600,
  minWidth: 180,
  justifyContent: 'center',
  '&:hover': {
    backgroundColor: '#0057A1',
  },
});

const SquareGreyButton = styled(Button)({
  backgroundColor: '#ccc',
  borderRadius: 0,
  color: '#000',
  padding: '12px 24px',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#bbb',
  },
});
