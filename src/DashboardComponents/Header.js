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
import { useNavigate } from "react-router-dom";
import "./Header.css"; // Import the CSS file

const Header = ({ toggleDarkMode, darkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const handleAvatarClick = () => {
    navigate("/UserProfile");
  };

  return (
    <AppBar
      position="static"
      className={`appBar ${darkMode ? "darkMode" : ""}`}
    >
      <Toolbar>
        <Typography
          variant={isMobile ? "h6" : "h5"}
          noWrap
          component="div"
          sx={{ flexGrow: 1 }}
          className="toolbarTitle"
        >
          My Dashboard
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* <IconButton
            onClick={toggleDarkMode}
            color="inherit"
            className="iconButton"
          >
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton> */}
          <Avatar
            alt="User Image"
            src="https://icons-for-free.com/iff/png/512/instagram+profile+user+icon-1320184028326496024.png"
            className="avatar"
            onClick={handleAvatarClick}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
