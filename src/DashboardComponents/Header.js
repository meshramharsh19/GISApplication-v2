import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
// import UserProfile from "./UserProfile";

const Header = ({ toggleDarkMode, darkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check if the screen size is mobile
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to handle avatar click and navigate to the user profile page
  const handleAvatarClick = () => {
    navigate("/UserProfile"); // Navigate to the profile route
  };

  return (
    <AppBar
      position="static"
      style={{
        background: darkMode
          ? "linear-gradient(45deg, #333, #444)" // Dark mode gradient background
          : "linear-gradient(45deg,rgb(67, 215, 237),rgb(48, 123, 134)", // Light mode gradient background
        boxShadow: "0 4px 8pxrgb(18, 64, 71)", // Add shadow for depth
        transition: "all 0.3s ease", // Smooth transition for background and shadow
      }}
    >
      
      <Toolbar>
        {/* Logo or Title */}
        <Typography
          variant={isMobile ? "h6" : "h5"} // Adjust the size based on screen size
          noWrap
          component="div"
          sx={{ flexGrow: 1 }}
          style={{
            marginLeft: 40,
            color: darkMode ? "#fff" : "#fff", // White text for both dark and light mode
            fontWeight: "bold",
            fontFamily: "'Roboto', sans-serif", // Modern font family
            letterSpacing: "1px", // Spacing between letters for a sleek look
          }}
        >
          My Dashboard
        </Typography>

        {/* Dark Mode Toggle */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={toggleDarkMode} color="inherit" style={{ marginRight: "10px" }}>
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <Avatar
            alt="User Image"
            src="https://icons-for-free.com/iff/png/512/instagram+profile+user+icon-1320184028326496024.png" // Replace with the user's image URL
            style={{
              width: 40,
              height: 40,
              border: "2px solid #fff",
              cursor: "pointer",
              transition: "transform 0.3s ease",
            }}
            onClick={handleAvatarClick} // Trigger navigation on avatar click
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
