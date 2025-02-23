import React, { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db, auth } from "../firebaseConfig";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import "../styles/dashboard.css";

const GEMINI_API_KEY = "AIzaSyDqPDl9Uz5Bn6SUUXrwH-zKycGqhO3Vczc";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [commands, setCommands] = useState([]);
  const [username, setUsername] = useState("Guest");

  const userId = auth.currentUser?.uid; // ✅ Get logged-in user's ID
  const { finalTranscript, listening, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      alert(
        "Speech Recognition is not supported in this browser. Please use Google Chrome."
      );
      return;
    }

    if (userId) {
      fetchBalance();
      fetchTransactions();
    }

    const storedUsername = localStorage.getItem("username") || "Guest";
    setUsername(storedUsername);
  }, [userId]);

  useEffect(() => {
    if (finalTranscript) {
      classifyCommand(finalTranscript);
    }
  }, [finalTranscript]);

  // ✅ Fetch Balance from Firestore (Ensures it persists)
  const fetchBalance = async () => {
    if (!userId) return;

    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.balance !== undefined) {
          console.log("Fetched Balance:", userData.balance);
          setBalance(userData.balance);
        } else {
          console.warn("Balance field missing, setting to 0.");
          setBalance(0);
        }
      } else {
        console.warn("User document not found. Creating a new one.");
        await setDoc(userRef, { balance: 0 });
        setBalance(0);
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  // ✅ Fetch Transactions from Firestore (Real-Time Updates)
  const fetchTransactions = () => {
    if (!userId) {
      console.error("User not logged in.");
      return;
    }

    const q = query(
      collection(db, "transactions"),
      where("userId", "==", userId)
    );

    return onSnapshot(q, (querySnapshot) => {
      let totalIncome = 0;
      let totalExpense = 0;
      const transactionsList = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        transactionsList.push(data);
        if (data.type === "income") totalIncome += data.amount || 0;
        if (data.type === "expense") totalExpense += data.amount || 0;
      });

      setTransactions(transactionsList);
    });
  };

  // ✅ Start Listening for Speech Commands
  const startListening = () => {
    SpeechRecognition.startListening({
      continuous: false,
      language: "en-IN",
      interimResults: false,
    }).catch((error) => {
      console.error("Microphone access denied:", error);
      alert("Please allow microphone access in your browser settings.");
    });
  };

  // ✅ Classify Command & Store in Firestore
  const classifyCommand = async (command) => {
    if (!command || !userId) return;

    SpeechRecognition.stopListening();
    const text = command.toLowerCase().trim();
    setCommands((prev) => [...prev, text]);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Classify this financial transaction as 'income' or 'expense': "${text}". 
      Extract the amount and a short description.
      Output format: {"type": "income/expense", "amount": number, "description": "short description"}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const data = JSON.parse(response.text());

      if (!data.type || !data.amount) {
        console.warn("Invalid classification:", data);
        return;
      }

      const transaction = {
        userId,
        type: data.type,
        amount: data.amount,
        description: data.description,
        date: new Date().toISOString(),
      };

      await addDoc(collection(db, "transactions"), transaction); // ✅ Store in Firestore Transactions

      // ✅ Update balance in `users` collection
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        let currentBalance = userSnap.data().balance || 0;
        const updatedBalance =
          data.type === "income"
            ? currentBalance + data.amount
            : currentBalance - data.amount;

        await updateDoc(userRef, { balance: updatedBalance }); // ✅ Update Firestore balance
        setBalance(updatedBalance); // ✅ Update UI balance immediately
      }
    } catch (error) {
      console.error("Gemini AI Error:", error);
    }
  };

  return (
    <div className="container">
      <h2>Hello {username.charAt(0).toUpperCase() + username.slice(1)} 👋</h2>
      <h3>Balance: ₹{balance}</h3>
      <h4>Click the Speak button and say a command, for example:</h4>
      <div className="commands">
        <ul>
          <li>
            ✅ Say: <b>"My grandfather gave me 1000 rupees"</b>
          </li>
          <li>
            ✅ Say: <b>"I spent 200 rupees on chocolates"</b>
          </li>
        </ul>
      </div>
      <button onClick={startListening}>🎤 Speak</button>
      <button onClick={SpeechRecognition.stopListening}>🛑 Stop</button>
      <p>{listening ? "Listening..." : ""}</p>

      <h3>Spoken Commands:</h3>
      <div className="spokencommands">
        <ul>
          {commands.map((cmd, index) => (
            <li key={index}>{cmd.charAt(0).toUpperCase() + cmd.slice(1)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
