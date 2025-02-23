import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css"; // Import the CSS file

const NavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h1 className="logo">Kid Bank</h1>

      {/* Hamburger Icon */}
      <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      {/* Navigation Links */}
      <ul className={`nav-links ${isOpen ? "active" : ""}`}>
        <li><Link to="/dashboard">Home</Link></li>
        <li><Link to="/transactions">Transactions</Link></li>
        <li><Link to="/savings">Savings</Link></li>
        <li><Link to="/summary">Summary</Link></li>
        <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
      </ul>
    </nav>
  );
};

export default NavigationBar;
