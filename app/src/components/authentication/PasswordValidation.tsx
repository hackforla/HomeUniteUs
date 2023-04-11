import {List, ListItem, ListSubheader, Stack} from '@mui/material';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

export const PasswordValidation = ({errorsLeft}) => {
  // when error in errorsLeft disappears, change hyphen to check circle
  // how to do this? ->
  // if is NOT in errorsLeft, change to checkRoundedIcon
  // get all the keys in errorsLeft
  const errors = errorsLeft[0] ? Object.keys(errorsLeft[0]) : [];
  // 1. initial state, check keys array and everything is remove rounded
  // 2. everytime there is a change in the keys array, check what is missing -> map? filter? find?
  // everytime there is a change, find what is missing
  // or everytime there is a change, only render what is there

  const listItems = [
    {
      name: '8-20 Characters',
      icon: errors.includes('length'),
    },
    {
      name: 'At least one number',
      icon: errors.includes('number'),
    },
    {
      name: 'At least one lowercase letter',
      icon: errors.includes('lowercase'),
    },
    {
      name: 'At least one capital letter',
      icon: errors.includes('uppercase'),
    },
    {
      name: 'At least one special character',
      icon: errors.includes('special'),
    },
  ];

  return (
    <Stack spacing={1}>
      <List>
        <ListSubheader>Password must contain:</ListSubheader>
        {listItems.map(item => {
          return (
            <ListItem key={item.name}>
              {/* initial state when errors.length === 0, render RemoveRounded */}
              {errors.length === 0 ? <RemoveRoundedIcon /> : null}
              {item.icon === false && errors.length > 0 ? (
                <CheckRoundedIcon />
              ) : null}
              {item.icon === true && <RemoveRoundedIcon />}
              {item.name}
            </ListItem>
          );
        })}
      </List>
    </Stack>
  );
};

// - neutral state
// green check - meets validation criteria
