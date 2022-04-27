import React from 'react';
import {styled} from '@mui/system';
import {Button, ButtonProps} from '@mui/material';

const BaseButton = ({...props}: ButtonProps) => {
  return <Button disableFocusRipple disableTouchRipple {...props} />;
};

const DefaultButton = styled(BaseButton)<ButtonProps>(({theme}) => ({
  padding: '16px 20px',
  border: 'none',
  textTransform: 'none',
  fontSize: '16px',
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

export const PrimaryButton = styled(DefaultButton)(({theme}) => ({
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

export const SecondaryButton = styled(DefaultButton)(({theme}) => ({
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
