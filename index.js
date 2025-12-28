// main index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const router = require("./routes/index.js");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use(router);
app.get("/", (req, res) => {
  res.status(200).send("🚀 Hello World! Server is Running");
});

connectDB();

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🌐 Server is listening on port: http://localhost:${PORT}`);
});
