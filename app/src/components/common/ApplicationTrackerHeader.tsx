import * as React from "react";

import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  InputBase,
  Badge,
  MenuItem,
  Menu,
} from "@mui/material";

import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import { Help } from "@mui/icons-material";
import { useAuth0 } from "@auth0/auth0-react";

const ElementIds = {
  ProfileMenu: "profile-trackernav-menu",
  MobileMenu: "mobile-trackernav-menu",
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
  OpenMobileMenu = "OpenMobileMenu",
  OpenProfileMenu = "OpenProfileMenu",
  CloseMobileMenu = "CloseMobileMenu",
  CloseProfileMenu = "CloseProfileMenu",
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
  action: ApplicationTrackerNavAction
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

export function ApplicationTrackerHeader() {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const { user } = useAuth0();

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
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ display: { xs: "flex" } }}>
            <img src="/img/huu.svg" width="50" />
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls={ElementIds.ProfileMenu}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <IconButton
              size="large"
              aria-label="show new notifications"
              color="inherit"
            >
              <Badge color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="get help"
              color="inherit"
              edge="end"
            >
              <Help />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={ElementIds.MobileMenu}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Menu
        anchorEl={state.mobileMenu.anchorElement}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        id={ElementIds.MobileMenu}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={state.mobileMenu.open}
        onClose={handleMobileMenuClose}
      >
        <MenuItem>
          <IconButton
            size="large"
            aria-label="show 4 new mails"
            color="inherit"
          >
            <Badge badgeContent={4} color="error">
              <MailIcon />
            </Badge>
          </IconButton>
          <p>Messages</p>
        </MenuItem>
        <MenuItem>
          <IconButton
            size="large"
            aria-label="show 17 new notifications"
            color="inherit"
          >
            <Badge badgeContent={17} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <p>Notifications</p>
        </MenuItem>
        <MenuItem onClick={handleProfileMenuOpen}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <p>Profile</p>
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={state.profileMenu.anchorElement}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        id={ElementIds.ProfileMenu}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={state.profileMenu.open}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Hello, {user?.email}</MenuItem>
        <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      </Menu>
    </Box>
  );
}

// const Search = styled("div")(({ theme }) => ({
//   position: "relative",
//   borderRadius: theme.shape.borderRadius,
//   backgroundColor: alpha(theme.palette.common.white, 0.15),
//   "&:hover": {
//     backgroundColor: alpha(theme.palette.common.white, 0.25),
//   },
//   marginRight: theme.spacing(2),
//   marginLeft: 0,
//   width: "100%",
//   [theme.breakpoints.up("sm")]: {
//     marginLeft: theme.spacing(3),
//     width: "auto",
//   },
// }));

// const SearchIconWrapper = styled("div")(({ theme }) => ({
//   padding: theme.spacing(0, 2),
//   height: "100%",
//   position: "absolute",
//   pointerEvents: "none",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
// }));

// const StyledInputBase = styled(InputBase)(({ theme }) => ({
//   color: "inherit",
//   "& .MuiInputBase-input": {
//     padding: theme.spacing(1, 1, 1, 0),
//     // vertical padding + font size from searchIcon
//     paddingLeft: `calc(1em + ${theme.spacing(4)})`,
//     transition: theme.transitions.create("width"),
//     width: "100%",
//     [theme.breakpoints.up("md")]: {
//       width: "20ch",
//     },
//   },
// }));
