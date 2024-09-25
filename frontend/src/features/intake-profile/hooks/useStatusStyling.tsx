import {useTheme} from '@mui/material/styles';
import {InProgressIcon} from '../../common/icons/InProgressIcon';
import LockIcon from '@mui/icons-material/Lock';
import {CheckCircleOutlined} from '@mui/icons-material';

const useStatusStyling = () => {
  const theme = useTheme();

  return {
    complete: {
      icon: <CheckCircleOutlined color="success" />,
      color: '#EAF2EA',
      borderColor: '#EAF2EA',
      shadow: 'grey.50',
    },
    incomplete: {
      icon: null,
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

export default useStatusStyling;
