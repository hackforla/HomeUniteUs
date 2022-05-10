import React from 'react';

import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Badge,
  MenuItem,
  Menu,
  useTheme,
} from '@mui/material';
import {styled} from '@mui/system';

import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import {Help} from '@mui/icons-material';
// import {useAuth0, User} from '@auth0/auth0-react';

import {Avatar} from './Avatar';
import logo from '../../img/spy.png';

const ElementIds = {
  ProfileMenu: 'profile-trackernav-menu',
  MobileMenu: 'mobile-trackernav-menu',
};

interface ApplicationTrackerNavMenuState {
  open: boolean;
  anchorElement: Element | null;
}

interface ApplicationTrackerNavState {
  profileMenu: ApplicationTrackerNavMenuState;
  mobileMenu: ApplicationTrackerNavMenuState;
}

enum ApplicationTrackerNavActionType {
  OpenMobileMenu = 'OpenMobileMenu',
  OpenProfileMenu = 'OpenProfileMenu',
  CloseMobileMenu = 'CloseMobileMenu',
  CloseProfileMenu = 'CloseProfileMenu',
}

interface ApplicationTrackerNavAction {
  type: ApplicationTrackerNavActionType;
  payload?: Element;
}

const initialState: ApplicationTrackerNavState = {
  profileMenu: {
    open: false,
    anchorElement: null,
  },
  mobileMenu: {
    open: false,
    anchorElement: null,
  },
};

function reducer(
  state: ApplicationTrackerNavState,
  action: ApplicationTrackerNavAction,
): ApplicationTrackerNavState {
  switch (action.type) {
    case ApplicationTrackerNavActionType.OpenProfileMenu:
      return {
        ...state,
        profileMenu: {
          ...state.profileMenu,
          open: true,
          anchorElement: action.payload as Element,
        },
      };
    case ApplicationTrackerNavActionType.OpenMobileMenu:
      return {
        ...state,
        mobileMenu: {
          ...state.mobileMenu,
          open: true,
          anchorElement: action.payload as Element,
        },
      };
    case ApplicationTrackerNavActionType.CloseProfileMenu:
      return {
        ...state,
        profileMenu: {
          ...state.profileMenu,
          open: false,
          anchorElement: null,
        },
      };
    case ApplicationTrackerNavActionType.CloseMobileMenu:
      return {
        ...state,
        mobileMenu: {
          ...state.mobileMenu,
          open: false,
          anchorElement: null,
        },
      };
    default:
      throw new Error(`Unsupported action: ${JSON.stringify(action)}`);
  }
}

const notificationLabel = (count: number) => {
  if (count < 1) {
    return 'no notifications';
  }

  return `you have notifications`;
};

export function ApplicationTrackerHeader() {
  const theme = useTheme();
  const [state, dispatch] = React.useReducer(reducer, initialState);

  // const {user, logout} = useAuth0();
  // const {name, picture} = user as User;

  const {user,logout,name,picture} = {
    user: {email: 'user@email.fake'},
    logout: () => {},
    name: 'Username',
    picture: 'https://dev.homeunite.us/img/favicon.png'
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    dispatch({
      type: ApplicationTrackerNavActionType.OpenProfileMenu,
      payload: event.currentTarget,
    });
  };

  const handleMobileMenuClose = () => {
    dispatch({
      type: ApplicationTrackerNavActionType.CloseMobileMenu,
    });
  };

  const handleMenuClose = () => {
    dispatch({
      type: ApplicationTrackerNavActionType.CloseProfileMenu,
    });
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    dispatch({
      type: ApplicationTrackerNavActionType.OpenMobileMenu,
      payload: event.currentTarget,
    });
  };

  return (
    <Box sx={{flexGrow: 1}}>
      <AppBar
        sx={{
          backgroundColor: '#fff',
          boxShadow: 'none',
          borderBottom: `1px solid ${theme.palette.grey[300]}`,
        }}
        position="static"
      >
        <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
          <Box sx={{display: {xs: 'flex'}}}>
            <img src={logo} height="88" />
          </Box>
          <Box sx={{display: {xs: 'none', md: 'flex'}, gap: '12px'}}>
            <IconButton
              sx={{color: theme.palette.grey[500]}}
              size="small"
              aria-label="account of current user"
              aria-controls={ElementIds.ProfileMenu}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar name={name} image={picture} />
            </IconButton>
            <IconButton
              sx={{color: theme.palette.grey[500], position: 'relative'}}
              size="small"
              aria-label={notificationLabel(0)}
              disableFocusRipple={true}
              disableRipple={true}
            >
              <NotificationsIcon
                sx={{
                  height: 50,
                  width: 50,
                }}
              />
              <NotificationsBadge />
            </IconButton>
            <IconButton
              size="small"
              aria-label="get help"
              color="inherit"
              edge="end"
            >
              <Help
                sx={{height: 50, width: 50, color: theme.palette.grey[500]}}
              />
            </IconButton>
          </Box>
          <Box sx={{display: {xs: 'flex', md: 'none'}}}>
            <IconButton
              sx={{color: theme.palette.grey[400]}}
              size="large"
              aria-label="show more"
              aria-controls={ElementIds.MobileMenu}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Menu
        sx={{display: {xs: 'flex', md: 'none'}}}
        anchorEl={state.mobileMenu.anchorElement}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        id={ElementIds.MobileMenu}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={state.mobileMenu.open}
        onClose={handleMobileMenuClose}
      >
        <MenuItem>
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
          <p>Messages</p>
        </MenuItem>
        <MenuItem>
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
          <p>Notifications</p>
        </MenuItem>
        <MenuItem onClick={handleProfileMenuOpen}>
          <AccountCircle />
          <p>Profile</p>
        </MenuItem>
      </Menu>
      <Menu
        sx={{display: {xs: 'none', md: 'inline-block'}}}
        anchorEl={state.profileMenu.anchorElement}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        id={ElementIds.ProfileMenu}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={state.profileMenu.open}
        onClose={handleMenuClose}
        aria-label="user account menu"
      >
        <MenuItem onClick={handleMenuClose}>Hello, {user?.email}</MenuItem>W
        <MenuItem onClick={handleMenuClose}>My account</MenuItem>
        <MenuItem onClick={() => logout({returnTo: window.location.origin})}>
          Log out
        </MenuItem>
      </Menu>
    </Box>
  );
}

const NotificationsBadge = styled('span')(({theme}) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  backgroundColor: theme.palette.primary.main,
  height: '16px',
  width: '16px',
  borderRadius: '50%',
  transform: 'translate3d(-8px, 8px, 0)',
}));
