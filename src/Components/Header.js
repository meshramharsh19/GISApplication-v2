import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Switch,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import "./Header.css"; // Import the CSS file

const Header = ({ toggleDarkMode, darkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check if the screen size is mobile

  return (
    <AppBar
      position="static"
      className={darkMode ? "app-bar-dark" : "app-bar-light"}
    >
      <Toolbar>
        {/* Logo or Title */}
        <Typography
          variant={isMobile ? "h6" : "h5"}
          noWrap
          component="div"
          className="title"
        >
          My Dashboard
        </Typography>

        {/* Dark Mode Toggle */}
        <Box className="toggle-container">
          <IconButton onClick={toggleDarkMode} color="inherit" className="icon-button">
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <Switch
            checked={darkMode}
            onChange={toggleDarkMode}
            color="default"
            inputProps={{ "aria-label": "dark mode toggle" }}
            className="dark-mode-switch"
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
