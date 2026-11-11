const Project = require("../models/Project");
const User = require("../models/User");

// Create Project
exports.createProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Project title is required" });
    }

    const project = await Project.create({
      title,
      description,
      owner: req.user._id,
      teamMembers: [req.user._id],
    });

    const populatedProject = await Project.findById(project._id)
      .populate("owner", "name email")
      .populate("teamMembers", "name email");

    res.status(201).json(populatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Projects for logged-in user
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { teamMembers: req.user._id }],
    })
      .populate("owner", "name email")
      .populate("teamMembers", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email")
      .populate("teamMembers", "name email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Project
exports.updateProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Only owner can update
    if (!project.owner.equals(req.user._id)) {
      return res.status(403).json({ message: "Only the owner can edit this project" });
    }

    project.title = title || project.title;
    project.description = description !== undefined ? description : project.description;
    await project.save();

    const updated = await Project.findById(project._id)
      .populate("owner", "name email")
      .populate("teamMembers", "name email");

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Only owner can delete
    if (!project.owner.equals(req.user._id)) {
      return res.status(403).json({ message: "Only the owner can delete this project" });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add Team Member by registered user email
exports.addTeamMember = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "User email is required" });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Only owner can add members
    if (!project.owner.equals(req.user._id)) {
      return res.status(403).json({ message: "Only the project owner can add team members" });
    }

    // Find the registered user
    const userToAdd = await User.findOne({ email: email.toLowerCase().trim() });
    if (!userToAdd) {
      return res.status(404).json({ message: "No registered user found with this email" });
    }

    // Check if user is already in teamMembers
    const isAlreadyMember = project.teamMembers.some((memberId) =>
      memberId.equals(userToAdd._id)
    );
    if (isAlreadyMember) {
      return res.status(400).json({ message: "User is already a team member" });
    }

    project.teamMembers.push(userToAdd._id);
    await project.save();

    const updated = await Project.findById(project._id)
      .populate("owner", "name email")
      .populate("teamMembers", "name email");

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove Team Member by User ID
exports.removeTeamMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Only owner can remove members
    if (!project.owner.equals(req.user._id)) {
      return res.status(403).json({ message: "Only the project owner can remove team members" });
    }

    // Owner cannot remove themselves
    if (project.owner.equals(memberId)) {
      return res.status(400).json({ message: "Project owner cannot be removed from the team" });
    }

    project.teamMembers = project.teamMembers.filter(
      (mId) => !mId.equals(memberId)
    );
    await project.save();

    const updated = await Project.findById(project._id)
      .populate("owner", "name email")
      .populate("teamMembers", "name email");

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
