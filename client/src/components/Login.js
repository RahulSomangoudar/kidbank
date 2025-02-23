import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig"; // ✅ Ensure correct import
import toast from "react-hot-toast";
import "../styles/login.css"; // ✅ Import CSS

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      // ✅ Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // Get authenticated user data

      toast.success("Login Successful!");

      // ✅ Save user data in localStorage
      localStorage.setItem("userId", user.uid);
      localStorage.setItem("email", user.email);

      navigate("/dashboard"); // ✅ Redirect after login
    } catch (error) {
      toast.error(error.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <p className="login-text">
          Don't have an account?{" "}
          <span className="login-link" onClick={() => navigate("/register")}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
