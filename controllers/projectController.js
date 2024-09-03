const Project = require("../models/project");
const User = require("../models/user");

// Create a new Project
exports.createProject = async (req, res, next) => {
  try {
    const Project_ = await Project.create(req.body);
    res.status(201).json({ success: true, data: Project_ });
  } catch (error) {
    next(error);
  }
};

// Get all Projects
exports.getProjects = async (req, res, next) => {
  try {
    const Projects = await Project.find();
    res.status(200).json({ success: true, data: Projects });
  } catch (error) {
    next(error);
  }
};

// Get a single Project by ID
exports.getProject = async (req, res, next) => {
  try {
    const Project = await Project.findById(req.params.id);
    if (!Project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    res.status(200).json({ success: true, data: Project });
  } catch (error) {
    next(error);
  }
};

// Update a Project by ID
exports.updateProject = async (req, res, next) => {
  try {
    const Project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!Project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    res.status(200).json({ success: true, data: Project });
  } catch (error) {
    next(error);
  }
};

// Delete a Project by ID
exports.deleteProject = async (req, res, next) => {
  try {
    const Project = await Project.findByIdAndDelete(req.params.id);
    if (!Project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// Delete a Project by ID
exports.assignProjects = async (req, res, next) => {
  try {
    const Projects = await Project.find({ isAssigned: false });
    console.log(Projects.length)
    console.log(req.body.no)
    console.log(req.body.userId)
    // console.log(req)
    if (!Projects) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    // Update each Project with the assigned user
    if (req.body.no < Projects.length) {
      const leedsAssign = Projects.slice(0, req.body.no);
      console.log(leedsAssign)
      const updates = leedsAssign.map((Project) =>
        Project.findByIdAndUpdate(
          Project._id,
          { assignedTo: req.body.userId, isAssigned: true },
          { new: true }
        )
      );

      await Promise.all(updates);
      // console.log(updates);
      res
        .status(200)
        .json({
          success: true,
          message: `${leedsAssign.length} Projects assigned successfully`,
        });
    } else {
      res
        .status(200)
        .json({ success: false, message: `${req.body.no} no enough Projects` });
    }
  } catch (error) {
    next(error);
  }
};



exports.updateCheckpoint= async (req, res) => {
  const { projectId, checkpointIndex } = req.params;
  const { completed } = req.body;

  try {
      // Find the project by ID
      const project = await Project.findById(projectId);
      if (!project) {
          return res.status(404).json({ success: false, message: 'Project not found' });
      }

      // Ensure checkpointIndex is within bounds
      if (checkpointIndex < 0 || checkpointIndex >= project.checkpoints.length) {
          return res.status(400).json({ success: false, message: 'Invalid checkpoint index' });
      }

      // Update the checkpoint status
      console.log(checkpointIndex , projectId)
      project.checkpoints[checkpointIndex].completed = completed;

      // Save the updated project
      await project.save();

      // Send back the updated project
      res.json({ success: true, project });
  } catch (error) {
      console.error('Error updating checkpoint:', error);
      res.status(500).json({ success: false, message: 'Server error' });
  }
};