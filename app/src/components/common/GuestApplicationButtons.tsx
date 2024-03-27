import {Button, Stack} from '@mui/material';

export const NavButtons = ({
  next,
  prev,
  openSections,
}: {
  next: () => void;
  prev: () => void;
  openSections: () => void;
}) => {
  return (
    <Stack gap={2}>
      <Button fullWidth size="medium" variant="contained" onClick={next}>
        Continue
      </Button>
      <Button
        fullWidth
        size="medium"
        variant="outlined"
        onClick={prev}
        sx={{color: 'black', border: 2, borderColor: 'primary.main'}}
      >
        Back
      </Button>
      <Button
        fullWidth
        size="medium"
        onClick={openSections}
        variant="text"
        sx={{color: 'black'}}
      >
        Return to Profile Sections
      </Button>
    </Stack>
  );
};
