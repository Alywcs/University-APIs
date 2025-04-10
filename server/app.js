const express = require("express");
require("dotenv").config();
const connectToDatabase = require("./db"); // Import the database connection function
const router = require("./router");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// General routing
app.use("/", router);

app.listen(PORT, async () => {
  try {
    // Connect to the database
    await connectToDatabase();

    console.log(`Server is running on port ${PORT}`);
  } catch (err) {
    console.error("Error connecting to the database: ", err);
  }
});
