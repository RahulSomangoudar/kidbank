import React, { useEffect, useState } from "react";
import { db, auth } from "../firebaseConfig";
import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import "../styles/summary.css";

const Summary = () => {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  });

  const userId = auth.currentUser?.uid; // ✅ Get logged-in user ID

  useEffect(() => {
    if (userId) {
      fetchSummary();
      fetchBalance();
    }
  }, [userId]);

  // ✅ Fetch Transactions Summary (Real-Time)
  const fetchSummary = () => {
    if (!userId) return;

    const q = query(collection(db, "transactions"), where("userId", "==", userId));

    return onSnapshot(q, (querySnapshot) => {
      let totalIncome = 0;
      let totalExpenses = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.type === "income") totalIncome += data.amount || 0;
        if (data.type === "expense") totalExpenses += data.amount || 0;
      });

      setSummary({
        totalIncome,
        totalExpenses,
        balance: totalIncome - totalExpenses, // ✅ Balance is calculated from transactions
      });
    });
  };

  // ✅ Fetch Balance from Firestore (`users` collection)
  const fetchBalance = async () => {
    if (!userId) return;

    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        setSummary((prev) => ({ ...prev, balance: userData.balance || 0 }));
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  return (
    <div className="summary-container">
      <h2 className="summary-title">Summary</h2>
      <div className="summary-box">
        <h3 className="income">Income: ₹{summary.totalIncome}</h3>
        <h3 className="expense">Expenses: ₹{summary.totalExpenses}</h3>
        <h3 className="balance">Balance: ₹{summary.balance}</h3>
      </div>
    </div>
  );
};

export default Summary;
