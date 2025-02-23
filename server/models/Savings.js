import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const db = getFirestore();

// Function to set or update savings goal
export const setSavingsGoal = async (userId, savingsGoal) => {
  try {
    const savingsRef = doc(db, "savings", userId);
    await setDoc(savingsRef, { savingsGoal }, { merge: true });
    console.log("✅ Savings goal updated");
  } catch (error) {
    console.error("❌ Error updating savings:", error);
  }
};

// Function to get savings goal
export const getSavingsGoal = async (userId) => {
  const savingsRef = doc(db, "savings", userId);
  const savingsSnap = await getDoc(savingsRef);
  return savingsSnap.exists() ? savingsSnap.data() : { savingsGoal: 0 };
};
