import React, { useEffect, useState } from "react";
import { db, auth } from "../firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import "../styles/transactions.css";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) return;

    const q = query(collection(db, "transactions"), where("userId", "==", userId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTransactions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTransactions(fetchedTransactions);
    });

    return () => unsubscribe(); // Cleanup listener
  }, [userId]);

  return (
    <div className="transactions-container">
      <h2 className="transactions-title">Your Transactions</h2>
      <div className="transactions-box">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id}>
                <td>{new Date(t.date).toLocaleDateString()}</td>
                <td className={t.type === "income" ? "income" : "expense"}>{t.type}</td>
                <td>₹{t.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;
  