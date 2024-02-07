import {Button, Stack} from '@mui/material';

export const NavButtons = ({
  next,
  prev,
  saveAndExit,
}: {
  next: () => void;
  prev: () => void;
  saveAndExit: () => void;
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
        onClick={saveAndExit}
        variant="text"
        sx={{color: 'black'}}
      >
        Save and Exit
      </Button>
    </Stack>
  );
};
