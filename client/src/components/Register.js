import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig"; // ✅ Import Firebase config
import toast from "react-hot-toast";
import "../styles/register.css"; // ✅ Import CSS

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      // ✅ Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Store additional user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
        balance: 0, // Default balance
      });

      toast.success("Registration successful! Please log in.");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Error during registration");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-title">Register</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            className="register-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="register-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="register-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="register-button">
            Register
          </button>
        </form>
        <p className="register-text">
          Already have an account?{" "}
          <span className="register-link" onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
