import React from 'react';
import useStatusStyling from '../../views/IntakeProfile/hooks/useStatusStyling';
import {Box, Typography, useTheme} from '@mui/material';
import {Link} from 'react-router-dom';
import {FieldGroup} from 'src/services/profile';

interface SidebarButtonProps {
  fieldTitle: FieldGroup['title'];
  isActive: boolean;
  handleClick?: () => void;
  status: 'complete' | 'partial' | 'incomplete' | 'locked';
  to: string;
}

export const SidebarButton = ({
  fieldTitle,
  handleClick,
  isActive,
  status,
  to,
}: SidebarButtonProps) => {
  const statusStyling = useStatusStyling();
  const theme = useTheme();

  return (
    <Box
      to={to}
      component={Link}
      sx={{
        borderRadius: 2,
        backgroundColor: statusStyling[status].color,
        minHeight: 56,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingInline: 3,
        borderColor: isActive ? '#DADADA' : statusStyling[status].borderColor,
        borderWidth: 2,
        borderStyle: 'solid',
        boxShadow: isActive ? '0px 4px 4px rgba(0, 0, 0, .25)' : 'none',
        textDecoration: 'none',
      }}
      onClick={handleClick && handleClick}
    >
      <Typography
        sx={{
          fontSize: 16,
          fontWeight: 'medium',
          color: theme.palette.text.primary,
        }}
      >
        {fieldTitle}
      </Typography>
      {statusStyling[status].icon}
    </Box>
  );
};
