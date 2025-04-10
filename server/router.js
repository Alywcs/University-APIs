const express = require("express");
const router = express.Router();
const { authenticate } = require("./middleware/authenticate");
const authController = require("./controllers/authController");
const universityController = require("./controllers/universityController");

// Test route

router.get("/test", (req, res) => res.send("API working Successful!"));

// Authentication routes
router.post("/login", authController.login);
router.post("/createUser", authController.createUser);

// University routes
router.get(
  "/university",
  authenticate,
  universityController.getAllUniversities
);
router.get(
  "/university/:id",
  authenticate,
  universityController.getUniversityById
);
router.post(
  "/university/create",
  authenticate,
  universityController.createUniversity
);
router.put(
  "/university/update/:id",
  authenticate,
  universityController.updateUniversity
);
router.post(
  "/university/delete/:id",
  authenticate,
  universityController.deleteUniversity
);
router.post(
  "/university/bookmark/:id",
  authenticate,
  universityController.bookmarkUniversity
);

module.exports = router;
