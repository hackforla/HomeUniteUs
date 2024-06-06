import {Box, Stack, Typography, useTheme} from '@mui/material';
import {Link} from 'react-router-dom';
import useStatusStyling from '../../views/IntakeProfile/hooks/useStatusStyling';

type Status = 'selected' | 'complete' | 'pending' | 'locked' | 'incomplete';

type FieldGroup = {
  id: string;
  title: string;
  status: Status;
};

export const ProfileSection = ({
  fieldGroups,
  handleClick,
}: {
  fieldGroups: FieldGroup[];
  handleClick: () => void;
}) => {
  const totalTask = fieldGroups.length - 1;
  const statusStyling = useStatusStyling();
  const theme = useTheme();
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
      {fieldGroups.map(({id, title, status}) => {
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
              borderColor: statusStyling[status].borderColor,
              borderWidth: 2,
              borderStyle: 'solid',
              boxShadow: statusStyling[status].shadow,
              textDecoration: 'none',
            }}
            onClick={handleClick}
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
