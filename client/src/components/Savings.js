import React, { useEffect, useState } from "react";
import { db, auth } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import "../styles/savings.css";

const Savings = () => {
  const [savingsGoal, setSavingsGoal] = useState(0);
  const [newSavingsGoal, setNewSavingsGoal] = useState("");
  const [balance, setBalance] = useState(0);

  const userId = auth.currentUser?.uid; // ✅ Get logged-in user ID

  useEffect(() => {
    if (userId) {
      fetchBalance();
      fetchSavingsGoal();
    }
  }, [userId]);

  // ✅ Fetch Balance from Firestore (`users` collection)
  const fetchBalance = async () => {
    if (!userId) return;

    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        setBalance(userData.balance || 0);
      } else {
        console.warn("User document not found.");
        setBalance(0);
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      toast.error("Error fetching balance!");
    }
  };

  // ✅ Fetch Savings Goal from Firestore (`savings` collection)
  const fetchSavingsGoal = async () => {
    if (!userId) return;

    try {
      const savingsRef = doc(db, "savings", userId);
      const savingsSnap = await getDoc(savingsRef);

      if (savingsSnap.exists()) {
        setSavingsGoal(savingsSnap.data().savingsGoal || 0);
      } else {
        setSavingsGoal(0);
      }
    } catch (error) {
      console.error("Error fetching savings goal:", error);
      toast.error("Error fetching savings goal!");
    }
  };

  // ✅ Set Savings Goal in Firestore
  const handleGoalUpdate = async () => {
    if (!newSavingsGoal || newSavingsGoal <= 0) {
      toast.error("Enter a valid savings goal!");
      return;
    }

    try {
      const savingsRef = doc(db, "savings", userId);
      await setDoc(savingsRef, { savingsGoal: newSavingsGoal }, { merge: true });

      toast.success("Savings goal updated!");
      setSavingsGoal(newSavingsGoal);
      setNewSavingsGoal("");
    } catch (error) {
      console.error("Error updating savings goal:", error);
      toast.error("Error updating savings goal!");
    }
  };

  const remainingToSave = Math.max(savingsGoal - balance, 0);

  return (
    <div className="savings-container">
      <h2 className="savings-title">Savings Tracker</h2>
      <h3 className="savings-balance">💰 Current Savings: ₹{balance}</h3>
      <h3 className="savings-goal">🎯 Savings Goal: ₹{savingsGoal || "Not set"}</h3>
      <h3 className="savings-remaining">📉 Remaining to Save: ₹{remainingToSave}</h3>

      <input
        type="number"
        value={newSavingsGoal}
        onChange={(e) => setNewSavingsGoal(e.target.value ? Number(e.target.value) : "")}
        placeholder="Enter savings goal"
        className="savings-input"
      />
      <button onClick={handleGoalUpdate} className="savings-button">
        Set Goal
      </button>
    </div>
  );
};

export default Savings;
