import {CheckCircleOutlined, CircleOutlined} from '@mui/icons-material';
import {Box, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';

export const SectionBox = ({
  complete,
  innerText,
  route,
}: {
  complete: boolean;
  innerText: string;
  route: string;
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(route);
  };
  return (
    <Box
      sx={{
        borderRadius: 2,
        backgroundColor: complete ? '#EAF2EA' : 'white',
        height: 56,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingInline: 3,
      }}
      onClick={handleClick}
    >
      <Typography sx={{fontSize: 16, fontWeight: 'medium'}}>
        {innerText}
      </Typography>
      {complete ? (
        <CheckCircleOutlined color="success" />
      ) : (
        <CircleOutlined color="action" />
      )}
    </Box>
  );
};
