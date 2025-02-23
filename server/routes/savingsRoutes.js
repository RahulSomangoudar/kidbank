import express from "express";
import { db } from "../firebaseConfig.js";

const router = express.Router();

// ✅ Get Savings Goal
router.get("/:userId", async (req, res) => {
  try {
    const userDoc = await db.collection("savings").doc(req.params.userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "Savings goal not found" });
    }

    res.json(userDoc.data());
  } catch (error) {
    res.status(500).json({ error: "Error fetching savings goal" });
  }
});

// ✅ Update Savings Goal
router.post("/update", async (req, res) => {
  try {
    const { userId, savingsGoal } = req.body;

    await db.collection("savings").doc(userId).set({ savingsGoal }, { merge: true });

    res.json({ message: "Savings goal updated successfully!" });
  } catch (error) {
    console.error("Error updating savings goal:", error);
    res.status(500).json({ error: "Failed to update savings goal" });
  }
});

export default router;
