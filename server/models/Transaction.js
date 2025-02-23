import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";

const db = getFirestore();

// Function to add a transaction
export const addTransaction = async (userId, type, amount, description) => {
  try {
    await addDoc(collection(db, "transactions"), {
      userId,
      type,
      amount,
      description,
      date: new Date(),
    });
    console.log("✅ Transaction added");
  } catch (error) {
    console.error("❌ Error adding transaction:", error);
  }
};

// Function to get transactions for a user
export const getTransactions = async (userId) => {
  const q = query(collection(db, "transactions"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data());
};
