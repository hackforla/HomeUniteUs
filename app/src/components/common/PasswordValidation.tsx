import {List, ListItem, ListSubheader, Stack} from '@mui/material';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import {useEffect, useState} from 'react';
import pwValidate from '../../utils/PasswordValidationSchema';

interface PasswordProps {
  password: string;
}

export const PasswordValidation = (password: PasswordProps) => {
  const [errorsLeft, setErrorsLeft] = useState<string[]>([]);
  console.log('errorsLeft', errorsLeft);
  console.log('password.password', password.password);

  useEffect(() => {
    const validatePwResults = async () => {
      const validated = await pwValidate(password.password);
      setErrorsLeft(validated ? Object.values(validated) : []);
    };
    validatePwResults();
  }, [password]);

  const errors = errorsLeft[0] ? Object.keys(errorsLeft[0]) : [];

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
