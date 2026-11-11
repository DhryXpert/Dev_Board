const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserInfo,
} = require("../controllers/authcontroller");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes (require valid JWT)
router.get("/me", protect, getUserInfo);

module.exports = router;

