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

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
  children: React.ReactElement;
}

const drawerWidth = 240;
const navItems = [
  {title: 'Home', href: '/'},
  {title: 'Login', href: '/signin'},
  {title: 'Sign Up', href: '/signup'},
];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

export const Header = (props: Props) => {
  const {window, children} = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );

  const handleDrawerToggle = () => {
    setMobileOpen(prevState => !prevState);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{textAlign: 'center'}}>
      <Typography variant="h6" sx={{my: 2}}>
        MUI
      </Typography>
      <Divider />
      <List>
        {navItems.map(({title}) => (
          <ListItem key={title} disablePadding>
            <ListItemButton sx={{textAlign: 'center'}}>
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
      <AppBar sx={{backgroundColor: 'white'}} component="nav">
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
              style={{width: '42px', height: '42px'}}
              src={logo}
              alt="Home Unite Us logo"
            />
            <Typography
              variant="h6"
              color="primary"
              component="div"
              sx={{flexGrow: 1, display: {xs: 'none', sm: 'block'}}}
            >
              Home Unite Us
            </Typography>
          </Stack>
          <Stack direction="row" gap={1} sx={{alignItems: 'center'}}>
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
            <Box sx={{flexGrow: 0}}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
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
                {settings.map(setting => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
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
      <Stack
        component="main"
        sx={{
          minHeight: '100vh',
          width: '100vw',
        }}
      >
        <Toolbar />
        {children}
      </Stack>
    </Box>
  );
};
