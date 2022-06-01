import React from 'react';
import {styled} from '@mui/system';
import {Button, ButtonProps} from '@mui/material';

export const BaseButton = ({...props}: ButtonProps) => {
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

export const SecondaryButton = styled(DefaultButton)({
  backgroundColor: 'transparent',
  color: 'black',
  border: '1px solid black',
  '&:hover': {
    backgroundColor: 'black',
    color: '#fff',
  },
  '&:active': {
    backgroundColor: 'black',
  },
  '&:disabled': {
    backgroundColor: 'transparent',
    color: 'black',
    border: `1px solid black`,
  },
});
