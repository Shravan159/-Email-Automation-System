require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("./db");  // Connect to MongoDB
const studentRoutes = require("./routes/studentRoutes");
const app = express();
app.use(express.json());
app.use(cors());

// ✅ API Routes
app.use("/api", studentRoutes);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
