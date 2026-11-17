const Comment = require("../models/Comment");
const Ticket = require("../models/Ticket");
const Project = require("../models/Project");

// Helper to check access
const verifyTicketAccess = async (ticketId, userId) => {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) return null;

  const project = await Project.findById(ticket.projectId);
  if (!project) return false;

  const hasAccess =
    project.owner.equals(userId) ||
    project.teamMembers.some((memberId) => memberId.equals(userId));

  return hasAccess ? ticket : false;
};

// @desc    Add comment to a ticket
// @route   POST /api/comments
exports.addComment = async (req, res) => {
  try {
    const { ticketId, text } = req.body;

    if (!ticketId || !text || !text.trim()) {
      return res.status(400).json({ message: "Ticket ID and comment text are required" });
    }

    const ticket = await verifyTicketAccess(ticketId, req.user._id);
    if (ticket === null) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    if (ticket === false) {
      return res.status(403).json({ message: "Not authorized to comment on this ticket" });
    }

    const comment = await Comment.create({
      ticketId,
      user: req.user._id,
      text: text.trim(),
    });

    const populated = await Comment.findById(comment._id).populate(
      "user",
      "name email"
    );

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get comments for a ticket
// @route   GET /api/comments/ticket/:ticketId
exports.getCommentsByTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await verifyTicketAccess(ticketId, req.user._id);
    if (ticket === null) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    if (ticket === false) {
      return res.status(403).json({ message: "Not authorized to view comments" });
    }

    const comments = await Comment.find({ ticketId })
      .populate("user", "name email")
      .sort({ createdAt: 1 }); // Chronological order

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a comment (author only)
// @route   DELETE /api/comments/:id
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (!comment.user.equals(req.user._id)) {
      return res.status(403).json({ message: "Only the author can delete this comment" });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

