const express = require("express");
const router = express.Router();
const {
  createTicket,
  getTicketsByProject,
  updateTicket,
  assignTicket,
  deleteTicket,
} = require("../controllers/ticketController");
const { protect } = require("../middleware/authMiddleware");

// All ticket endpoints require authentication
router.use(protect);

router.post("/", createTicket);
router.get("/project/:projectId", getTicketsByProject);
router.put("/:id", updateTicket);
router.patch("/:id/assign", assignTicket);
router.delete("/:id", deleteTicket);

module.exports = router;

