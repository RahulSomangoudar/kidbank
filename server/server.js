import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js"; 
import transactionRoutes from "./routes/transactionRoutes.js"; 
import savingsRoutes from "./routes/savingsRoutes.js";  
import summaryRoutes from "./routes/summaryRoutes.js"; // ✅ Import with `.js`


dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({
  origin: [""], // No trailing slash
  methods: ["POST", "GET"],
  credentials: true
}));

app.use("/auth", authRoutes);
app.use("/transactions", transactionRoutes); 
app.use("/savings", savingsRoutes);  
app.use("/summary", summaryRoutes); 

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
