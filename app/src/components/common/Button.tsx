import React from 'react';
import {styled} from '@mui/system';

interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'secondary';
  label: string;
  fullWidth?: boolean;
  onClick: () => void;
}

export const Button = ({
  variant = 'primary',
  label,
  fullWidth = false,
  onClick,
  disabled,
  ...props
}: ButtonProps) => {
  const componentVariants = {
    primary: PrimaryButton,
    secondary: SecondaryButton,
  };

  const ButtonComponent = componentVariants[variant];

  const handleClick = () => {
    if (disabled) return;

    onClick();
  };

  return (
    <ButtonComponent
      sx={{width: fullWidth ? '100%' : null}}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {label}
    </ButtonComponent>
  );
};

const DefaultButton = styled('button')(({theme}) => ({
  border: 'none;',
  padding: '16px 20px',
  fontWeight: 700,
  [theme.breakpoints.down('md')]: {
    padding: '12px 16px',
  },
  borderRadius: theme.shape.borderRadius,
  transition: '.2s all ease',
  '&:hover': {
    cursor: 'pointer',
  },
  '&:disabled': {
    cursor: 'not-allowed',
  },
}));

const PrimaryButton = styled(DefaultButton)(({theme}) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  '&:hover': {
    backgroundColor: '#36A3E7',
  },
  '&:active': {
    backgroundColor: '#6ABBED',
  },
  '&:disabled': {
    backgroundColor: '#ACD9F5',
  },
}));

const SecondaryButton = styled(DefaultButton)(({theme}) => ({
  backgroundColor: 'transparent',
  border: '1px solid black',
  '&:hover': {
    backgroundColor: theme.palette.grey[700],
  },
  '&:active': {
    backgroundColor: theme.palette.grey[500],
  },
  '&:disabled': {
    backgroundColor: 'transparent',
    color: theme.palette.grey[700],
    border: `1px solid ${theme.palette.grey[700]}`,
  },
}));
