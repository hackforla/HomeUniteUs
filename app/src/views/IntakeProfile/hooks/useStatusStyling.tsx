import {useTheme} from '@mui/material/styles';
import {InProgressIcon} from '../../../components/Icons/InProgressIcon';
import {LockedIcon} from '../../../components/Icons/LockedIcon';
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
      icon: <LockedIcon />,
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
