import {Button, Stack} from '@mui/material';
import React from 'react';
interface Props {
  text: string;
  variant: 'contained' | 'filled';
  onClick: () => void;
}

export const FormButton = ({text, variant, onClick}: Props) => {
  return (
    <Stack>
      {variant}
      <Button fullWidth size="medium" variant="contained" onClick={onClick}>
        {text}
      </Button>
      <Button
        fullWidth
        size="medium"
        variant="outlined"
        sx={{color: 'black', border: 2, borderColor: 'primary.main'}}
      >
        {text}
      </Button>
      <Button fullWidth size="medium" variant="text" sx={{color: 'black'}}>
        {text}
      </Button>
    </Stack>
  );
};
