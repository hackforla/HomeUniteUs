import React from 'react';
import {Button, Stack} from '@mui/material';

interface ProfileActionsProps {
  handleBack: () => void;
  handleNext: () => void;
  handleSubmitApplication: () => void;
  toggleShowSections: () => void;
}

export const ProfileActions = ({
  handleBack,
  handleNext,
  handleSubmitApplication,
  toggleShowSections,
}: ProfileActionsProps) => {
  return (
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
  );
};
