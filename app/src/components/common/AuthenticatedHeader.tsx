import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {Tooltip, Avatar, Menu, MenuItem, Stack} from '@mui/material';
import logo from '../../img/favicon.png';
import {useSignOutMutation} from '../../services/auth';
import {useAppDispatch} from '../../app/hooks/store';
import {setCredentials} from '../../app/authSlice';

import {Link, useNavigate} from 'react-router-dom';
import {styled} from '@mui/system';

const userName = 'Hank Hill';

function getInitials(name: string) {
  const splitName = name.split(' ');

  if (splitName.length === 1) return splitName[0][0];

  return splitName[0][0] + splitName[splitName.length - 1][0];
}

interface OwnProps {
  onClick: () => void;
}

export const AuthenticatedHeader = ({onClick}: OwnProps) => {
  return (
    <Box sx={{display: 'flex'}}>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: '#ffffff',
          zIndex: theme => theme.zIndex.drawer + 1,
          boxShadow: 'none',
        }}
        component="nav"
      >
        <Toolbar sx={{justifyContent: {xs: 'space-between'}}}>
          <IconButton
            aria-label="open drawer"
            edge="start"
            onClick={onClick}
            sx={{mr: 2, height: '40px', width: '40px', display: {sm: 'none'}}}
          >
            <MenuIcon />
          </IconButton>
          <StyledLogo src={logo} alt="Home Unite Us logo" />
          <Stack direction="row" gap={1} sx={{alignItems: 'center'}}>
            <AvatarDropdownMenu />
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

const StyledLogo = styled('img')(({theme}) => ({
  width: '40px',
  height: '40px',
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

const AvatarDropdownMenu = () => {
  const [signOut] = useSignOutMutation();
  const appDispatch = useAppDispatch();
  const navigate = useNavigate();

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );

  const handleSignOut = async () => {
    try {
      await signOut().unwrap();
      appDispatch(setCredentials({user: null, token: null}));
      navigate('/signin');
    } catch (err) {
      console.log(err);
    }
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box sx={{flexGrow: 0}}>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
          {/* Replace with real user name */}
          <Avatar alt={userName}>{getInitials(userName)}</Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        sx={{mt: '45px'}}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem component={Link} to="/settings">
          <Typography textAlign="center">Settings</Typography>
        </MenuItem>
        <MenuItem
          component="a"
          target="_blank"
          href="https://github.com/hackforla/HomeUniteUs/wiki/Home-Unite-Us-User-Guide"
        >
          <Typography textAlign="center">Help</Typography>
        </MenuItem>
        <MenuItem onClick={handleSignOut}>
          <Typography textAlign="center">Logout</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};
