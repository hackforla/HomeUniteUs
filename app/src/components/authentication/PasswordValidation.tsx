import {List, ListItem, ListSubheader, Stack} from '@mui/material';

export const PasswordValidation = () => {
  return (
    <Stack spacing={1}>
      <List>
        <ListSubheader>Password must contain:</ListSubheader>
        <ListItem> 8-20 Characters</ListItem>
        <ListItem> At least one number</ListItem>
        <ListItem> At least one capital letter</ListItem>
        <ListItem>At least one special character</ListItem>
      </List>
    </Stack>
  );
};

// - neutral state
// green check - meets validation criteria
// red x -
