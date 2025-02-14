import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Brightness4,
  Brightness7,
  Settings,
  Help,
  Book,
  Logout,
  AccountCircle,
  ArrowDropDown,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = ({ toggleDarkMode, darkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
const [isAuthenticated, setIsAuthenticated] = useState(true);

 const handleLogout = async () => {
    try {
      const response = await fetch('/api/users/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        // Update authentication state
        setIsAuthenticated(false);
        // Redirect to home page
        navigate('/');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const menuItems = [
    {
      text: "Profile",
      icon: <AccountCircle />,
      onClick: handleClose,
    },
    {
      text: "Settings",
      icon: <Settings />,
      onClick: handleClose,
    },
    {
      text: "Guide",
      icon: <Book />,
      onClick: handleClose,
    },
    {
      text: "Help Center",
      icon: <Help />,
      onClick: handleClose,
    },
    {
      text: "Logout",
      icon: <Logout />,
      onClick: handleLogout,
    },
  ];

  const appBarStyle = {
    "--appBarBackground": darkMode
      ? `linear-gradient(145deg, ${theme.palette.background.default}, ${theme.palette.grey[900]})`
      : `linear-gradient(145deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
    "--appBarBoxShadow": darkMode
      ? "0 4px 20px 0 rgba(0, 0, 0, 0.25)"
      : "0 4px 20px 0 rgba(0, 0, 0, 0.15)",
    "--avatarBorderColor": theme.palette.background.paper,
    "--menuBackground": theme.palette.background.paper,
    "--menuItemHoverBackground": theme.palette.primary.main,
    "--menuItemIconColor": theme.palette.primary.main,
  };

  return (
    <AppBar position="fixed" className="appBar" style={appBarStyle}>
      <Toolbar className="toolbar">
        <Typography
          className="Dashbord"
          variant={isMobile ? "h6" : "h5"}
          noWrap
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 600,
            letterSpacing: "0.5px",
            opacity: 0.95,
          }}
        >
          My Dashboard
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            onClick={handleAvatarClick}
            sx={{
              padding: 0.5,
              "&:hover": { backgroundColor: "transparent" },
            }}
          >
            <Avatar
              alt="User Image"
              src="https://icons-for-free.com/iff/png/512/instagram+profile+user+icon-1320184028326496024.png"
              className="avatar"
            />
            <ArrowDropDown
              className={`arrowIcon ${open ? "open" : ""}`}
              sx={{ color: "white" }}
            />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            className="menu"
          >
            {menuItems.map((item, index) => (
              <MenuItem
                key={index}
                onClick={item.onClick}
                className="menuItem"
                sx={{
                  animation: `fadeIn ${0.1 + index * 0.05}s ease-out`,
                }}
              >
                <ListItemIcon className="menuItemIcon">
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    "& .MuiTypography-root": {
                      fontWeight: 500,
                    },
                  }}
                />
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
