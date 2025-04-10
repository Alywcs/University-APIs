const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connectToDatabase = require("../db");

// Function for Login
exports.login = async function (req, res) {
  const { username, password } = req.body;
  const query = "SELECT * FROM users WHERE Username = ?";

  try {
    const connection = await connectToDatabase();
    const result = await connection.query(query, [username]);
    if (!result || result[0].length < 1) {
      connection.release();
      return res.json({
        success: false,
        message: "Invalid username/password.",
      });
    } else {
      const user = result[0][0];
      const passwordMatch = bcrypt.compareSync(password, user.Password);

      if (passwordMatch) {
        const payload = {
          username: user.Username,
        };
        const secretKey = process.env.JWT_SECRET;
        const options = { expiresIn: process.env.JWT_EXPIRY };
        const token = jwt.sign(payload, secretKey, options); // Create token

        return res.json({
          success: true,
          message: "You have successfully logged in.",
          token: token, // Send the token back to the client
        });
      } else {
        connection.release();
        return res.json({
          success: false,
          message: "Invalid username/password",
        });
      }
    }
  } catch (err) {
    console.error("Error while fetching user:", err);
    res.json({
      success: false,
      message: "Failed to process login.",
    });
  }
};

exports.createUser = async function (req, res) {
  const { username, password } = req.body;
  const query = "SELECT * FROM users WHERE Username = ?";

  try {
    const connection = await connectToDatabase();
    const result = await connection.query(query, [username]);

    // Check if the user already exist
    if (result[0].length > 0) {
      connection.release();
      res.json({
        success: false,
        message: "User already existed.",
      });
    } else {
      // Hash the password before storing it in the database
      const hashedPassword = await bcrypt.hash(password, 10);

      // Add and save the user to the database
      await connection.execute(
        "INSERT INTO users (Username, Password) VALUES (?, ?)",
        [username, hashedPassword]
      );
      connection.release();

      res.json({ success: true, message: "User registered successfully" });
    }
  } catch (err) {
    console.error("Error registering user: ", err);
    res.json({ error: "Internal Server Error" });
  }
};
