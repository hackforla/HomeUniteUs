import {Button} from '@mui/material';
interface Props {
  text: string;
  variant: 'outline' | 'fill';
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
            sx={{
              color: 'black',
              border: 2,
              borderColor: 'primary.main',
              width: mobile ? '100%' : 161,
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
