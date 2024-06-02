import {Button} from '@mui/material';
interface Props {
  text: string;
  variant: 'outline' | 'fill' | 'transparent';
  onClick: () => void;
  mobile: boolean;
}

export const FormButton = ({text, variant, onClick, mobile}: Props) => {
  const renderButton = () => {
    switch (variant) {
      case 'fill':
        return (
          <Button
            size="medium"
            variant="contained"
            onClick={onClick}
            sx={{width: mobile ? '100%' : 183}}
          >
            {text}
          </Button>
        );
      case 'outline':
        return (
          <Button
            size="medium"
            variant="outlined"
            onClick={onClick}
            sx={{
              color: 'primary.main',
              border: 2,
              borderColor: 'primary.main',
              width: mobile ? '100%' : 161,
            }}
          >
            {text}
          </Button>
        );
      case 'transparent':
        return (
          <Button
            size="medium"
            variant="text"
            onClick={onClick}
            sx={{
              border: 2,
              width: mobile ? '100%' : 161,
              color: 'black',
              borderColor: 'transparent',
            }}
          >
            {text}
          </Button>
        );
      default:
        return (
          <Button
            size="medium"
            variant="contained"
            onClick={onClick}
            sx={{width: mobile ? '100%' : 183}}
          >
            {text}
          </Button>
        );
    }
  };
  return <>{renderButton()}</>;
};
