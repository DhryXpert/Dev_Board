const Ticket = require("../models/Ticket");
const Project = require("../models/Project");

// Helper to check if current user is owner or member of the project
const verifyProjectAccess = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) return null;
  const hasAccess =
    project.owner.equals(userId) ||
    project.teamMembers.some((memberId) => memberId.equals(userId));
  return hasAccess ? project : false;
};

// @desc    Create a new ticket
// @route   POST /api/tickets
exports.createTicket = async (req, res) => {
  try {
    const { title, description, priority, status, projectId, assignee } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({ message: "Title and Project ID are required" });
    }

    const project = await verifyProjectAccess(projectId, req.user._id);
    if (project === null) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (project === false) {
      return res.status(403).json({ message: "Not authorized to add tickets to this project" });
    }

    const ticket = await Ticket.create({
      title,
      description,
      priority: priority || "Medium",
      status: status || "To Do",
      projectId,
      assignee: assignee || null,
      createdBy: req.user._id,
    });

    const populated = await Ticket.findById(ticket._id)
      .populate("assignee", "name email")
      .populate("createdBy", "name email");

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all tickets for a specific project (with optional query filters: search, status, priority, assignee, sort)
// @route   GET /api/tickets/project/:projectId
exports.getTicketsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { search, status, priority, assignee, sort } = req.query;

    const project = await verifyProjectAccess(projectId, req.user._id);
    if (project === null) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (project === false) {
      return res.status(403).json({ message: "Not authorized to view tickets for this project" });
    }

    // Build dynamic query
    const query = { projectId };

    // Status filter
    if (status && status !== "All") {
      query.status = status;
    }

    // Priority filter
    if (priority && priority !== "All") {
      query.priority = priority;
    }

    // Assignee filter: support "unassigned" or specific user ObjectId
    if (assignee && assignee !== "All") {
      if (assignee === "unassigned") {
        query.assignee = null;
      } else {
        query.assignee = assignee;
      }
    }

    // Keyword search across title and description
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    // Sorting: default newest first (-createdAt)
    let sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "priority") sortOption = { priority: -1 };

    const tickets = await Ticket.find(query)
      .populate("assignee", "name email")
      .populate("createdBy", "name email")
      .sort(sortOption);

    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update ticket details or status (e.g., drag and drop)
// @route   PUT /api/tickets/:id
exports.updateTicket = async (req, res) => {
  try {
    const { title, description, priority, status, assignee } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const project = await verifyProjectAccess(ticket.projectId, req.user._id);
    if (!project) {
      return res.status(403).json({ message: "Not authorized to update this ticket" });
    }

    // Authorization: Project owner, ticket creator, assignee, or workspace admin
    const isOwner = project.owner.equals(req.user._id);
    const isCreator = ticket.createdBy.equals(req.user._id);
    const isAssignee = ticket.assignee && ticket.assignee.equals(req.user._id);
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isCreator && !isAssignee && !isAdmin) {
      return res.status(403).json({
        message: "Only the project owner, ticket creator, or assignee can edit this ticket",
      });
    }

    if (title !== undefined) ticket.title = title;
    if (description !== undefined) ticket.description = description;
    if (priority !== undefined) ticket.priority = priority;
    if (status !== undefined) ticket.status = status;
    if (assignee !== undefined) ticket.assignee = assignee || null;

    await ticket.save();

    const updated = await Ticket.findById(ticket._id)
      .populate("assignee", "name email")
      .populate("createdBy", "name email");

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign user to a ticket
// @route   PATCH /api/tickets/:id/assign
exports.assignTicket = async (req, res) => {
  try {
    const { assignee } = req.body; // userId or null
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const project = await verifyProjectAccess(ticket.projectId, req.user._id);
    if (!project) {
      return res.status(403).json({ message: "Not authorized to modify this ticket" });
    }

    // Authorization: Project owner, ticket creator, or workspace admin
    const isOwner = project.owner.equals(req.user._id);
    const isCreator = ticket.createdBy.equals(req.user._id);
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isCreator && !isAdmin) {
      return res.status(403).json({
        message: "Only the project owner or ticket creator can assign users to this ticket",
      });
    }

    ticket.assignee = assignee || null;
    await ticket.save();

    const updated = await Ticket.findById(ticket._id)
      .populate("assignee", "name email")
      .populate("createdBy", "name email");

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a ticket
// @route   DELETE /api/tickets/:id
exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const project = await verifyProjectAccess(ticket.projectId, req.user._id);
    if (!project) {
      return res.status(403).json({ message: "Not authorized to delete this ticket" });
    }

    // Authorization: Only the project owner, ticket creator, or workspace admin can delete
    const isOwner = project.owner.equals(req.user._id);
    const isCreator = ticket.createdBy.equals(req.user._id);
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isCreator && !isAdmin) {
      return res.status(403).json({
        message: "Only the project owner or ticket creator can delete this ticket",
      });
    }

    await Ticket.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

