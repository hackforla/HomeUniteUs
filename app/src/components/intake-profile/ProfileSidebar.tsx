import {Box, Stack, Typography, useTheme} from '@mui/material';
import {Link} from 'react-router-dom';
import useStatusStyling from '../../views/IntakeProfile/hooks/useStatusStyling';
import {Dispatch, SetStateAction} from 'react';

type FieldGroup = {
  id: string;
  title: string;
};

export const ProfileSidebar = ({
  fieldGroups,
  handleSectionClick,
  setSelectedItem,
  groupId,
}: {
  fieldGroups: FieldGroup[];
  handleSectionClick: () => void;
  setSelectedItem: Dispatch<SetStateAction<string | null>>;
  groupId: string;
}) => {
  const totalTask = fieldGroups.length - 1;
  const statusStyling = useStatusStyling();
  const theme = useTheme();

  const handleItemClick = (id: string) => {
    setSelectedItem(id);
    handleSectionClick();
  };

  return (
    <>
      <Stack
        sx={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: '35px 35px 0px 0px',
        }}
      >
        <Typography sx={{fontSize: 18, fontWeight: 'medium', marginBottom: 1}}>
          Profile Sections
        </Typography>
        <Typography sx={{fontSize: 14, fontWeight: 'medium'}}>
          {0 /* needs to be implemented*/} of {totalTask}
        </Typography>
      </Stack>
      {fieldGroups.map(({id, title}) => {
        const status = 'complete'; // Change status here to see different styles
        // complete | partial | incomplete | locked
        const fieldTitle = title || '...';
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
              boxShadow:
                groupId === id ? '0px 4px 4px rgba(0, 0, 0, .25)' : 'none',
              textDecoration: 'none',
            }}
            onClick={() => handleItemClick(id)}
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
      })}
    </>
  );
};
