const express = require("express");
const router = express.Router();
const {
  addComment,
  getCommentsByTicket,
  deleteComment,
} = require("../controllers/commentController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/", addComment);
router.get("/ticket/:ticketId", getCommentsByTicket);
router.delete("/:id", deleteComment);

module.exports = router;

