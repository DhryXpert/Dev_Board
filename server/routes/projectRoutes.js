const express = require("express");
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addTeamMember,
  removeTeamMember,
} = require("../controllers/projectController");
const { protect } = require("../middleware/authMiddleware");

// All routes are protected by auth middleware
router.post("/", protect, createProject);
router.get("/", protect, getProjects);
router.get("/:id", protect, getProjectById);
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);

// Team member routes
router.post("/:id/members", protect, addTeamMember);
router.delete("/:id/members/:memberId", protect, removeTeamMember);

module.exports = router;
