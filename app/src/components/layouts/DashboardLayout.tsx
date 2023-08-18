import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TimelineOutlined from '@mui/icons-material/TimelineOutlined';
import {Link} from '@mui/material';
import {styled} from '@mui/system';
import {Outlet, useLocation} from 'react-router-dom';

import {Header} from '../common';

const drawerWidth = 209;

const navItems = [
  {title: 'Dashboard', icon: <TimelineOutlined />, href: '/guest'},
  {title: 'My Documents', icon: <TimelineOutlined />, href: '/guest/documents'},
];

export function DashboardLayout() {
  const location = useLocation();

  return (
    <Box sx={{display: 'flex'}}>
      <Header />
      <StyledDrawer variant="permanent">
        <Toolbar />
        <StyledList>
          {navItems.map(({title, icon, href}) => {
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
                  <ListItemText primary={title} />
                </StyledListItemButton>
              </ListItem>
            );
          })}
        </StyledList>
      </StyledDrawer>
      <Box component="main" sx={{flexGrow: 1}}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

interface ListItemProps {
  isSelected: boolean;
}

const StyledList = styled(List)(({theme}) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: `${theme.spacing(5)} ${theme.spacing(2)} 0 ${theme.spacing(2)}`,
  gap: theme.spacing(3),
}));

const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: prop => prop !== 'isSelected',
})<ListItemProps>(({isSelected, theme}) => ({
  gap: 1,
  borderRadius: theme.shape.borderRadius,
  color: isSelected ? 'black' : 'white',
  backgroundColor: isSelected ? 'white' : 'transparent',
  boxShadow: isSelected ? '0px 4px 10px rgba(0, 0, 0, 0.25)' : 'none',
  '&:hover': {
    backgroundColor: isSelected ? 'white' : 'transparent',
  },
}));

const StyledListItemIcon = styled(ListItemIcon, {
  shouldForwardProp: prop => prop !== 'isSelected',
})<ListItemProps>(({isSelected, theme}) => ({
  color: isSelected ? 'black' : 'white',
  minWidth: 0,
  marginRight: theme.spacing(1),
}));

const StyledDrawer = styled(Drawer)(({theme}) => ({
  width: drawerWidth,
  flexShrink: 0,
  [`& .MuiDrawer-paper`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.primary.main,
  },
}));
