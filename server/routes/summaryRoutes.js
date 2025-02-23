import express from "express";
import { db, collection, query, where, getDocs } from "../firebaseConfig.js";

const router = express.Router();

// 🔹 Fetch Summary for a Specific User
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const transactionsQuery = query(
      collection(db, "transactions"),
      where("userId", "==", userId)
    );

    const transactionsSnapshot = await getDocs(transactionsQuery);
    const transactions = transactionsSnapshot.docs.map((doc) => doc.data());

    // Calculate totals
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    res.json({ totalIncome, totalExpenses, balance });
  } catch (error) {
    console.error("Error fetching summary:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
