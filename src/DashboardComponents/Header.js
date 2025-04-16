import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Button,
} from "@mui/material";
import {
  Settings,
  Help,
  Book,
  Logout,
  AccountCircle,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = ({ toggleDarkMode, darkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    setIsLoaded(true);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setShowHeader(false); // Scroll down -> hide header
      } else {
        setShowHeader(true); // Scroll up -> show header
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLogout = async () => {
    try {
      await fetch("/api/users/logout", {
        method: "POST",
        credentials: "include",
      });
      setIsAuthenticated(false);
      window.location.reload();
    } catch (error) {
      console.error("Error during logout:", error);
      setIsAuthenticated(false);
      window.location.reload();
    }
  };

  const handleUserProfile = () => {
    navigate("/user-profile");
  };

  const menuItems = [
    { text: "Profile", icon: <AccountCircle />, onClick: handleUserProfile, sx: { color: "black" } },
    { text: "Settings", icon: <Settings />, onClick: () => {}, sx: { color: "black" } },
    { text: "Guide", icon: <Book />, onClick: () => {}, sx: { color: "black" } },
    { text: "Help Center", icon: <Help />, onClick: () => {}, sx: { color: "black" } },
    { text: "Logout", icon: <Logout />, onClick: handleLogout, sx: { color: "red" } },
  ];

  return (
    <Box
      className={`cardHeader ${darkMode ? "darkMode" : ""} ${
        isLoaded ? "loaded" : ""
      } ${showHeader ? "show" : "hide"}`}
    >
      <Box className="headerContent">
        <Typography
          variant="h5"
          component="div"
          className="headerTitle"
          sx={{ fontWeight: 600 }}
        >
          Dashboard
        </Typography>

        <Box className="menuButtons">
          {menuItems.map((item, index) => (
            <Button
              key={index}
              startIcon={item.icon}
              onClick={item.onClick}
              className={`headerButton ${item.text === "Logout" ? "logout" : ""}`}
              sx={item.sx}
              aria-label={item.text} // Added for accessibility
            >
              {item.text}
            </Button>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
