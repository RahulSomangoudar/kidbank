import express from "express";
import { db, collection, addDoc, query, where, getDocs, orderBy } from "../firebaseConfig.js";

const router = express.Router();

// 🔹 Add Transaction
router.post("/add", async (req, res) => {
  try {
    const { userId, type, amount, description } = req.body;

    if (!userId || !type || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newTransaction = {
      userId,
      type,
      amount,
      description,
      date: new Date().toISOString(), // Ensure a timestamp is stored
    };

    // Add transaction to Firestore
    const docRef = await addDoc(collection(db, "transactions"), newTransaction);

    res.status(201).json({ message: "Transaction added successfully", transactionId: docRef.id });
  } catch (error) {
    console.error("Error adding transaction:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 🔹 Fetch Transactions by User
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const transactionsQuery = query(
      collection(db, "transactions"),
      where("userId", "==", userId),
      orderBy("date", "desc")
    );

    const transactionsSnapshot = await getDocs(transactionsQuery);
    const transactions = transactionsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
