import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import {Link} from '@mui/material';
import {styled} from '@mui/system';
import {Outlet, useLocation} from 'react-router-dom';

import {AuthenticatedHeader} from '../ui';

const DRAWER_WIDTH = 209;
const MOBILE_DRAWER_WIDTH = 296;

interface OwnProps {
  window?: () => Window;
  navItems: {
    title: string;
    icon: React.ReactNode;
    href: string;
  }[];
}

export function DashboardLayout({window, navItems}: OwnProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(prevState => !prevState);
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const navListItems = navItems.map(({title, icon, href}) => {
    const isSelected = location.pathname === href;

    return (
      <ListItem
        sx={{py: 0, px: 0}}
        component={Link}
        underline="none"
        href={href}
        key={title}
      >
        <StyledListItemButton isSelected={isSelected}>
          <StyledListItemIcon isSelected={isSelected}>
            {icon}
          </StyledListItemIcon>
          <ListItemText
            sx={{[`& .MuiListItemText-primary`]: {fontWeight: 'bold'}}}
            primary={title}
          />
        </StyledListItemButton>
      </ListItem>
    );
  });

  return (
    <Box sx={{display: 'flex'}}>
      <AuthenticatedHeader onClick={handleDrawerToggle} />
      <StyledDrawer
        width={DRAWER_WIDTH}
        variant="permanent"
        sx={{
          display: {xs: 'none', md: 'block'},
        }}
      >
        <Toolbar />
        <StyledList>{navListItems}</StyledList>
      </StyledDrawer>
      <StyledDrawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: {xs: 'block', md: 'none'},
        }}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        width={MOBILE_DRAWER_WIDTH}
      >
        <Toolbar />
        <Box onClick={handleDrawerToggle}>
          <StyledList>{navListItems}</StyledList>
        </Box>
      </StyledDrawer>
      <Box component="main" sx={{flex: 1}}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

interface ListItemProps {
  isSelected: boolean;
}

interface DrawerProps {
  width: number;
}

const StyledList = styled(List)(({theme}) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: `${theme.spacing(6)} ${theme.spacing(2)} 0 ${theme.spacing(2)}`,
  gap: theme.spacing(3),
  boxSizing: 'border-box',
}));

const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: prop => prop !== 'isSelected',
})<ListItemProps>(({isSelected, theme}) => ({
  border: '1px solid transparent',
  gap: 1,
  borderRadius: theme.shape.borderRadius,
  color: isSelected
    ? theme.palette.text.primary
    : theme.palette.primary.contrastText,
  backgroundColor: isSelected
    ? theme.palette.primary.contrastText
    : 'transparent',
  boxShadow: isSelected ? '0px 4px 10px rgba(0, 0, 0, 0.25)' : 'none',
  '&:hover': {
    backgroundColor: isSelected
      ? theme.palette.primary.contrastText
      : 'transparent',
    border: `1px solid ${theme.palette.primary.contrastText}}`,
  },
}));

const StyledListItemIcon = styled(ListItemIcon, {
  shouldForwardProp: prop => prop !== 'isSelected',
})<ListItemProps>(({isSelected, theme}) => ({
  color: isSelected
    ? theme.palette.text.primary
    : theme.palette.primary.contrastText,
  minWidth: 0,
  marginRight: theme.spacing(1),
}));

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: prop => prop !== 'width',
})<DrawerProps>(({width, theme}) => ({
  width: width,
  flexShrink: 0,
  [`& .MuiDrawer-paper`]: {
    width: width,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.primary.main,
  },
}));
