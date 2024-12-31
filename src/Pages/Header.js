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

const Header = ({ toggleDarkMode, darkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check if the screen size is mobile

  return (
    <AppBar
      position="static"
      style={{
        backgroundColor: darkMode ? "#333" : "#1976d2",
        boxShadow: "none", // Optional: Remove or add shadow to distinguish the header
      }}
    >
      <Toolbar>
        {/* Logo or Title */}
        <Typography
          variant={isMobile ? "h6" : "h5"} // Adjust the size based on screen size
          noWrap
          component="div"
          sx={{ flexGrow: 1 }}
          style={{ marginLeft:30,color: darkMode ? "#fff" : "#fff" }}
        >
          My Dashboard
        </Typography>

        {/* Dark Mode Toggle */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={toggleDarkMode} color="inherit">
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <Switch
            checked={darkMode}
            onChange={toggleDarkMode}
            color="default"
            inputProps={{ "aria-label": "dark mode toggle" }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
