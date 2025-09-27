import React, { useEffect } from "react";
import { Typography } from "@mui/material";
import "./Welcome.css"; // Import the CSS file for Welcome component

const Welcome = () => {
  useEffect(() => {
    // This will apply the animation class when the component mounts
    const welcomeContainer = document.querySelector(".welcome-container");
    if (welcomeContainer) {
      welcomeContainer.classList.add("animate-popup");
    }
  }, []); 

  return (
    <div className="welcome-container">
      <div class="welcome-text">Welcome to the GIS Dashboard</div>
    </div>

  );
};

export default Welcome;