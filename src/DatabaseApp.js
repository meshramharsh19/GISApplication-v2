import React, { useState, useMemo, useEffect } from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS for Map DashboardComponents
import Header from "./DashboardComponents/Header";
import Dashboard from "./DashboardComponents/Dashboard";
import "./App.css"; // Import the new CSS file


const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Check if the dark mode preference is saved in localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedMode);
  }, []);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: {
            main: darkMode ? "#bb86fc" : "#6200ea", // Primary color (e.g., purple for dark, blue for light)
          },
          secondary: {
            main: darkMode ? "#03dac6" : "#018786", // Secondary color (e.g., teal for dark, dark teal for light)
          },
          background: {
            default: darkMode ? "#121212" : "#fafafa", // Background color (dark background for dark mode, light background for light mode)
            paper: darkMode ? "#333" : "#fff", // Paper color (cards, modals, etc.)
          },
          text: {
            primary: darkMode ? "#fff" : "#000", // Text color (white text for dark mode, black text for light mode)
            secondary: darkMode ? "#b0b0b0" : "#444", // Secondary text color
          },
        },
        typography: {
          fontFamily: "'Roboto', sans-serif", // Customize font family
          h1: {
            fontSize: "2rem", // Customize header size
            fontWeight: 600,
          },
          body1: {
            fontSize: "1rem", // Customize body text size
            fontWeight: 400,
          },
        },
      }),
    [darkMode]
  );

  // Function to toggle dark mode and save it to localStorage
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("darkMode", newMode); // Save the preference
      return newMode;
    });
  };

  return (
    <ThemeProvider theme={theme}>
      {/* Apply global theme */}
      <CssBaseline />
      <div className="app-container">
        <div className="app-content">
          {/* Pass toggleDarkMode and darkMode to Header */}
          <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
          <Dashboard />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
