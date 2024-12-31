import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import HeroSection from './Pages/HeroSection';
import Footer from './Pages/Footer';
import CardContainer from './Pages/CardContainer';
import LoginPage from './Components/LoginPage';
import SignupPage from './Components/SignupPage';
import ForgotPasswordPage from './Components/ForgotPasswordPage';
import TopLoadingBar from 'react-top-loading-bar';
import DashboardApp from './DatabaseApp';
import UserProfile from './DashboardComponents/UserProfile'


function App() {
  const [progress, setProgress] = useState(0);
  

  const handleButtonClick = () => {
    setProgress(30);
    setTimeout(() => setProgress(100), 1000);
  };

  useEffect(() => {
    setProgress(100);
    setTimeout(() => {
      setProgress(0);
    }, 2000);
  }, []);

  return (
    <Router>
      <TopLoadingBar
        progress={progress}
        color="#ffc107"
        height={3}
        onLoaderFinished={() => setProgress(0)}
      />
      <Routes>
        <Route path="/" element={<HeroSection handleButtonClick={handleButtonClick} />} />
        <Route path="/login" element={<LoginPage handleButtonClick={handleButtonClick} />} />
        <Route path="/signup" element={<SignupPage handleButtonClick={handleButtonClick} />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage handleButtonClick={handleButtonClick} />} />
        <Route path="/DashboardApp" element={<DashboardApp />} />
        <Route path="/DashboardApp" element={<DashboardApp />} />
        <Route path="/UserProfile" element={<UserProfile />} />
        <Route path="/" element={<HeroSection />} />
      </Routes>
      <CardContainer />
      <Footer />
    </Router>
  );
}

export default App;
