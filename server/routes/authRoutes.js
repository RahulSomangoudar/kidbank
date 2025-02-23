import express from "express";
import { auth, db } from "../firebaseConfig.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const router = express.Router();

// 🔹 User Registration
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store additional user data in Firestore
    await db.collection("users").doc(user.uid).set({
      username,
      email,
      balance: 0,
      createdAt: new Date(),
    });

    res.status(201).json({ message: "User registered successfully", userId: user.uid });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({ message: error.message });
  }
});

// 🔹 User Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    res.json({ message: "Login successful", userId: user.uid, email: user.email });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(400).json({ message: "Invalid email or password" });
  }
});

export default router;
