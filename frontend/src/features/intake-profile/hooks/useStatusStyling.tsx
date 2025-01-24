import {useTheme} from '@mui/material/styles';
import {InProgressIcon} from '../../ui/icons/InProgressIcon';
import LockIcon from '@mui/icons-material/Lock';
import {CheckCircleOutlined} from '@mui/icons-material';
import {Box} from '@mui/material';

export const useStatusStyling = () => {
  const theme = useTheme();

  return {
    complete: {
      icon: <CheckCircleOutlined color="success" />,
      color: '#EAF2EA',
      borderColor: '#EAF2EA',
      shadow: 'grey.50',
    },
    incomplete: {
      icon: (
        <Box
          sx={{
            width: 24,
            height: 24,
            border: `2px solid white`,
            borderRadius: `100%`,
          }}
        />
      ),
      color: theme.palette.primary.contrastText,
      borderColor: 'grey.50',
      shadow: 'grey.50',
    },
    locked: {
      icon: (
        <LockIcon
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.38)',
            borderRadius: '50%',
            padding: '5px',
            color: 'rgba(0, 0, 0, 0.54)',
          }}
        />
      ),
      color: '#E8E8E8',
      borderColor: 'grey.50',
      shadow: 'grey.50',
    },
    partial: {
      icon: <InProgressIcon />,
      color: theme.palette.primary.contrastText,
      borderColor: 'grey.50',
      shadow: 'grey.50',
    },
  };
};
