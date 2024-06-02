import {Button, SxProps} from '@mui/material';
interface Props {
  text: string;
  variant: 'outline' | 'fill' | 'transparent';
  onClick: () => void;
  mobile: boolean;
  customStyles?: SxProps;
}

export const FormButton = ({
  text,
  variant,
  onClick,
  mobile,
  customStyles,
}: Props) => {
  const renderButton = () => {
    switch (variant) {
      case 'fill':
        return (
          <Button
            size="medium"
            variant="contained"
            onClick={onClick}
            sx={{width: mobile ? '100%' : 183, ...customStyles}}
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
            style={{border: '2px solid', width: mobile ? '100%' : 161}} //in styles to prevent bug where button becomes smaller on hover
            sx={{...customStyles}}
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
              ...customStyles,
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
            sx={{width: mobile ? '100%' : 183, ...customStyles}}
          >
            {text}
          </Button>
        );
    }
  };
  return <>{renderButton()}</>;
};
