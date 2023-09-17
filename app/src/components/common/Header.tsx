import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import {Stack} from '@mui/material';
import logo from '../../img/favicon.png';

const navItems = [
  {title: 'Login', href: '/signin'},
  {title: 'Sign Up', href: '/signup'},
];
//start from lowest level items and work my way up to avoid removing important items
export const Header = () => {
  //change component and file name
  const [mobileOpen, setMobileOpen] = React.useState(false);
  mobileOpen;

  const handleDrawerToggle = () => {
    setMobileOpen(prevState => !prevState);
  };

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
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
