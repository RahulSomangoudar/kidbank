import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import Home from "./components/Home";
import Transactions from "./components/Transactions";
import Savings from "./components/Savings";
import Summary from "./components/Summary";
import Dashboard from "./components/Dashboard";
import Register from "./components/Register";
import Login from "./components/Login";
import Footer from "./components/Footer";
import toast, { Toaster } from "react-hot-toast"; // ✅ Import react-hot-toast
import "./styles/footer.css";
import './App.css' ;

const App = () => {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="app-container">
        <Routes>
          {/* Public Pages (No Navbar) */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Private Pages (With Navbar) */}
          <Route
            path="/*"
            element={
              <div className="main-content">
                <NavigationBar /> {/* ✅ Navbar outside Routes to stay persistent */}
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/transactions" element={<Transactions />} />
                  <Route path="/savings" element={<Savings />} />
                  <Route path="/summary" element={<Summary />} />
                </Routes>
              </div>
            }
          />
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
};

export default App;
