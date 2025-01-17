import React, { useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  Tooltip,
  Typography,
  useMediaQuery,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import LayersIcon from "@mui/icons-material/Layers";
import PublicIcon from "@mui/icons-material/Public";

// Import individual components
import Location from "./sidebarOptions/Location";
import ShapeFileExtractor from "./sidebarOptions/ShapeFileExtractor";
import KML from "./sidebarOptions/KML";
import KMZ from "./sidebarOptions/KMZ";
import Welcome from "./Welcome"; // Import the Welcome component
import "./Dashboard.css"; 

const Dashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const renderContent = () => {
    switch (selectedOption) {
      case "Location":
        return <Location />;
      case "Shape File Extractor":
        return <ShapeFileExtractor />;
      case "KML":
        return <KML />;
      case "KMZ":
        return <KMZ />;
      default:
        return <Welcome />; // Render the Welcome component
    }
  };

  return (
    <Box>
      {/* Toggle Sidebar Button */}
      <Tooltip title="Toggle Sidebar">
        <Box className="sidebar-toggle-container">
          <IconButton
            aria-label="toggle sidebar"
            onClick={toggleSidebar}
            className="sidebar-toggle-button"
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Tooltip>

      {/* Sidebar Drawer */}
      <Drawer
        variant={isSmallScreen ? "temporary" : "persistent"}
        anchor="left"
        open={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        className="sidebar-drawer"
      >
        <Box role="presentation" className="sidebar-content">
          {/* Sidebar Title */}
          <Typography variant="h5" className="sidebar-title">
            My Dashboard
          </Typography>

          {/* Sidebar Options */}
          <List className="sidebar-options-list">
            {[
              { text: "Location", icon: <LocationOnIcon /> },
              { text: "Shape File Extractor", icon: <FileDownloadIcon /> },
              { text: "KML", icon: <LayersIcon /> },
              { text: "KMZ", icon: <PublicIcon /> },
            ].map((item) => (
              <ListItem
                button
                key={item.text}
                onClick={() => setSelectedOption(item.text)}
                className={`sidebar-option-item ${
                  selectedOption === item.text ? "selected" : ""
                }`}
              >
                <ListItemIcon className="sidebar-option-icon">
                  {item.icon}
                </ListItemIcon>
                {isSidebarOpen && <Typography>{item.text}</Typography>}
              </ListItem>
            ))}
          </List>

          <Divider className="sidebar-divider" />
        </Box>
      </Drawer>

      {/* Floating Icons when Sidebar is Closed */}
      {!isSidebarOpen && (
        <Box className="floating-icons-container">
          {[
            { text: "Location", icon: <LocationOnIcon /> },
            { text: "Shape File Extractor", icon: <FileDownloadIcon /> },
            { text: "KML", icon: <LayersIcon /> },
            { text: "KMZ", icon: <PublicIcon /> },
          ].map((item) => (
            <Tooltip key={item.text} title={item.text} placement="right">
              <IconButton
                onClick={() => setSelectedOption(item.text)}
                className="floating-icon-button"
              >
                {item.icon}
              </IconButton>
            </Tooltip>
          ))}
        </Box>
      )}

      {/* Main Content */}
      <Box
        className="main-content"
        style={{ marginLeft: isSmallScreen || !isSidebarOpen ? 0 : 250 }}
      >
        {renderContent()} 
      </Box>
    </Box>
  );
};

export default Dashboard;