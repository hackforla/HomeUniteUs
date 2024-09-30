import {List, ListItem, ListSubheader} from '@mui/material';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import {useEffect, useState} from 'react';
import pwValidate from '../../utils/validation-schemas';

interface PasswordProps {
  password: string;
  confirmPassword?: string;
}

export const PasswordValidation = ({
  password,
  confirmPassword,
}: PasswordProps) => {
  const [errorsLeft, setErrorsLeft] = useState<string[]>([]);

  useEffect(() => {
    const validatePwResults = async () => {
      const validated = await pwValidate(password);
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
    <List sx={{padding: 0}}>
      <ListSubheader sx={{padding: 0, lineHeight: 1.5, mb: 1}}>
        Password must contain:
      </ListSubheader>
      {listItems.map(item => {
        return (
          <ListItem key={item.name} sx={{padding: 0, mb: 1}}>
            {errors.length === 0 ? <RemoveRoundedIcon /> : null}
            {item.icon === false && errors.length > 0 ? (
              <CheckRoundedIcon color="success" />
            ) : null}
            {item.icon === true && <RemoveRoundedIcon />}
            {item.name}
          </ListItem>
        );
      })}
      {confirmPassword !== undefined ? (
        <ListItem key="confirmPassword" sx={{padding: 0, mb: 1}}>
          {errors.length === 0 ? <RemoveRoundedIcon /> : null}
          {confirmPassword.length > 0 && confirmPassword === password ? (
            <CheckRoundedIcon color="success" />
          ) : null}
          {confirmPassword !== password && errors.length > 0 ? (
            <RemoveRoundedIcon />
          ) : null}
          Passwords must match
        </ListItem>
      ) : null}
    </List>
  );
};
