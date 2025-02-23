import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const db = getFirestore();

// Function to create a user in Firestore
export const createUser = async (userId, username, email) => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, {
      username,
      email,
      balance: 0, // Default balance
    });
    console.log("✅ User added to Firestore");
  } catch (error) {
    console.error("❌ Error adding user:", error);
  }
};

// Function to get a user from Firestore
export const getUser = async (userId) => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() : null;
};
