import * as React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import {
  Drawer,
  IconButton,
  Stack,
  Button,
  Toolbar,
  Box,
  AppBar,
  styled,
} from '@mui/material';

const MOBILE_DRAWER_WIDTH = 209;

const navItems = [
  {title: 'Login', href: '/signin'},
  {title: 'Sign Up', href: '/signup'},
];

export const Header = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(prevState => !prevState);
  };

  const container =
    window !== undefined ? () => window.document.body : undefined;

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
              src="/images/favicon.png"
              alt="Home Unite Us logo"
            />
          </Stack>
          <Stack direction="row" gap={1} sx={{alignItems: 'center'}}>
            <Box sx={{display: {md: 'flex', sm: 'none', xs: 'none'}}}>
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
          <IconButton
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{height: '40px', width: '40px', display: {md: 'none'}}}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
        <StyledDrawer
          anchor="right"
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          sx={{
            display: {xs: 'block', md: 'none'},
            zIndex: theme => theme.zIndex.drawer + 2,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          width={MOBILE_DRAWER_WIDTH}
        >
          <Box
            onClick={handleDrawerToggle}
            sx={{display: 'flex', flexDirection: 'column', mt: 2, gap: 2}}
          >
            {navItems.map(({title, href}) => {
              return (
                <Button variant="text" href={href} color="primary" key={title}>
                  {title}
                </Button>
              );
            })}
          </Box>
        </StyledDrawer>
      </AppBar>
    </Box>
  );
};

interface DrawerProps {
  width: number;
}
const StyledDrawer = styled(Drawer, {
  shouldForwardProp: prop => prop !== 'width',
})<DrawerProps>(({width}) => ({
  width: width,
  flexShrink: 0,
  [`& .MuiDrawer-paper`]: {
    width: width,
    boxSizing: 'border-box',
  },
}));
