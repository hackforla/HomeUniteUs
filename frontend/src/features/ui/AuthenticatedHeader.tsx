import * as React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import {styled} from '@mui/system';
import {
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  Stack,
  IconButton,
  Toolbar,
  Typography,
  Box,
  AppBar,
  Link,
} from '@mui/material';
import {useSelector} from 'react-redux';
import {Link as RouterLink, useNavigate} from 'react-router-dom';

import {useSignOutMutation} from '../../services/auth';
import {selectCurrentUser} from '../../redux/authSlice';
import {User, UserRole} from '../../services/user';
import {useAuth} from '../../redux/hooks/useAuth';

function getInitials(user: User): string {
  const fi = (user.firstName && user.firstName[0]) || '?';
  const li = (user.lastName && user.lastName[0]) || '';

  return fi + li;
}

interface OwnProps {
  onClick?: () => void;
}

const homeRoute: {[key: string]: string} = {
  guest: '/guest',
  host: '/host',
  coordinator: '/coordinator',
};

export const AuthenticatedHeader = ({onClick}: OwnProps) => {
  const {user} = useAuth();

  const home = user !== null ? homeRoute[user.role.type] : '';

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
          {onClick ? (
            <IconButton
              aria-label="open drawer"
              edge="start"
              onClick={onClick}
              sx={{mr: 2, height: '40px', width: '40px', display: {md: 'none'}}}
            >
              <MenuIcon />
            </IconButton>
          ) : null}
          <Link to={home} component={RouterLink} sx={{display: 'flex'}}>
            <StyledLogo src="/images/favicon.png" alt="Home Unite Us logo" />
          </Link>
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
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const AvatarDropdownMenu = () => {
  const [signOut] = useSignOutMutation();
  const navigate = useNavigate();

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );

  const handleSignOut = async () => {
    try {
      await signOut().unwrap();
      navigate('/');
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

  // If the user ever fails to load, then display
  // ?? as the initials for debugging purposes
  const user = useSelector(selectCurrentUser) || {
    role: {} as UserRole,
    email: 'unknown',
    firstName: '?',
    lastName: '?',
  };

  return (
    <Box sx={{flexGrow: 0}}>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
          <Avatar alt={user.firstName + user.lastName}>
            {getInitials(user)}
          </Avatar>
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
        <MenuItem component={RouterLink} to="/settings">
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
