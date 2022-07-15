import {FormLabel} from '@mui/material';
import {styled} from '@mui/material/styles';

export const ApplicationFormLabel = styled(FormLabel)(({theme}) => ({
  fontSize: '1.5rem',
  fontWeight: theme.typography.fontWeightMedium,
  color: theme.palette.text.primary,
})) as typeof FormLabel;
