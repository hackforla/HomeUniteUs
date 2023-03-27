import {List, ListItem, ListSubheader, Stack} from '@mui/material';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

export const PasswordValidation = ({errorsLeft}) => {
  // when errorsLeft.length === null, keep it hyphen
  // when errorsLeft.length === 1, all change to close rounded
  // when error in errorsLeft disappears, change to check circle
  // how to do this? ->
  console.log('errorsLeft', errorsLeft);
  return (
    <Stack spacing={1}>
      <List>
        <ListSubheader>Password must contain:</ListSubheader>
        <ListItem>
          <RemoveRoundedIcon /> 8-20 Characters
        </ListItem>
        <ListItem>
          <CloseRoundedIcon />
          At least one number
        </ListItem>
        <ListItem>
          <CheckRoundedIcon />
          At least one capital letter
        </ListItem>
        <ListItem>
          <RemoveRoundedIcon />
          At least one special character
        </ListItem>
      </List>
    </Stack>
  );
};

// - neutral state
// green check - meets validation criteria
// red x -
