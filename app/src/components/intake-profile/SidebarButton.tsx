import React from 'react';
import useStatusStyling from '../../views/IntakeProfile/hooks/useStatusStyling';
import {Box, Typography, useTheme} from '@mui/material';
import {Link} from 'react-router-dom';
import {FieldGroup} from 'src/services/profile';

interface SidebarButtonProps {
  fieldTitle: FieldGroup['title'];
  groupId: string | undefined;
  handleClick: (id: string) => void;
  id: FieldGroup['id'];
  status: 'complete' | 'partial' | 'incomplete' | 'locked';
}

export const SidebarButton = ({
  fieldTitle,
  groupId,
  handleClick,
  id,
  status,
}: SidebarButtonProps) => {
  const statusStyling = useStatusStyling();
  const theme = useTheme();

  return (
    <Box
      key={id}
      to={`group/${id}`}
      component={Link}
      sx={{
        borderRadius: 2,
        backgroundColor: statusStyling[status].color,
        minHeight: 56,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingInline: 3,
        borderColor:
          groupId === id ? '#DADADA' : statusStyling[status].borderColor,
        borderWidth: 2,
        borderStyle: 'solid',
        boxShadow: groupId === id ? '0px 4px 4px rgba(0, 0, 0, .25)' : 'none',
        textDecoration: 'none',
      }}
      onClick={() => handleClick(id)}
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
