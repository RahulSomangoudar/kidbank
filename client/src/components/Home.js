import React from "react";
import { Link } from "react-router-dom";
import "../styles/home.css"; // Import the CSS file

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="title" >Welcome to Kid Bank</h1>
      <p>A fun way to track and manage money for kids!</p>
      <div className="home-buttons">
        <Link to="/register">
          <button className="home-button">Register</button>
        </Link>
        <Link to="/login">
          <button className="home-button">Login</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
