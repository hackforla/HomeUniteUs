import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {Tooltip, Avatar, Menu, MenuItem, Stack} from '@mui/material';
import logo from '../../img/favicon.png';
import {useAuth} from '../../app/hooks/useAuth';
import {useSignOutMutation} from '../../services/auth';
import {useAppDispatch} from '../../app/hooks/store';
import {setCredentials} from '../../app/authSlice';
import {Link, useNavigate} from 'react-router-dom';

const userName = 'Hank Hill';

function getInitials(name: string) {
  const splitName = name.split(' ');

  if (splitName.length === 1) return splitName[0][0];

  return splitName[0][0] + splitName[splitName.length - 1][0];
}

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

const drawerWidth = 240;
const navItems = [
  {title: 'Login', href: '/signin'},
  {title: 'Sign Up', href: '/signup'},
];

export const Header = (props: Props) => {
  const {window} = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const {user} = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(prevState => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{textAlign: 'center'}}>
      <Typography variant="h6" sx={{my: 2}}>
        MUI
      </Typography>
      <Divider />
      <List>
        {navItems.map(({title, href}) => (
          <ListItem key={title} disablePadding>
            <ListItemButton sx={{textAlign: 'center'}} href={href}>
              <ListItemText primary={title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{display: 'flex'}}>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: 'white',
          zIndex: theme => theme.zIndex.drawer + 1,
          boxShadow: 'none',
        }}
        component="nav"
      >
        <Toolbar sx={{justifyContent: {xs: 'space-between'}}}>
          <IconButton
            color="primary"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{mr: 2, display: {sm: 'none'}}}
          >
            <MenuIcon />
          </IconButton>
          <Stack direction="row" gap={1} sx={{alignItems: 'center'}}>
            <img
              style={{width: '40px', height: '40px'}}
              src={logo}
              alt="Home Unite Us logo"
              onClick={handleDrawerToggle}
              role="button"
            />
          </Stack>
          <Stack direction="row" gap={1} sx={{alignItems: 'center'}}>
            {!user ? (
              <Box sx={{display: {xs: 'none', sm: 'flex'}}}>
                {navItems.map(({title, href}) => {
                  const variant = title === 'Sign Up' ? 'contained' : 'text';
                  return (
                    <Button
                      variant={variant}
                      href={href}
                      color="primary"
                      key={title}
                    >
                      {title}
                    </Button>
                  );
                })}
              </Box>
            ) : null}
            {user ? <AvatarDropdownMenu /> : null}
          </Stack>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: {xs: 'block', sm: 'none'},
            '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
};

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
