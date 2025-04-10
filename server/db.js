const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" }); // Allow the process to load environment variables

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  queueLimit: 0,
});

const promisePool = pool.promise(); // Create a promise-based pool

// Function to connect to the database
async function connectToDatabase() {
  try {
    // Use promisePool to get a connection
    const connection = await promisePool.getConnection();
    console.log("Connected to the database");
    return connection;
  } catch (err) {
    console.error("Error connecting to the database: ", err);
    throw err;
  }
}

module.exports = connectToDatabase;
