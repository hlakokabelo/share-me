import express from "express";
import dotenv from "dotenv";
import { connedDB } from "./lib/db.js";

dotenv.config();

const PORT = process.env.PORT || 5002;
const app = express();

//body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//Routes
import authRoutes from "./routes/authRoutes.js";

app.use("/api/auth", authRoutes);
app.get('/',(req,res)=>{
  res.json("Hello world")
})
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connedDB();
});
