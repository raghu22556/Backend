const Blog = require("../models/blog");

// Create a new Blog
exports.createBlog = async (req, res, next) => {
  try {
    const Blog_ = await Blog.create(req.body);
    res.status(201).json({ success: true, data: Blog_ });
  } catch (error) {
    next(error);
  }
};

// Get all Blogs
exports.getBlogs = async (req, res, next) => {
  try {
    const Blogs = await Blog.find();
    res.status(200).json({ success: true, data: Blogs });
  } catch (error) {
    next(error);
  }
};

// Get a single Blog by ID
exports.getBlog = async (req, res, next) => {
  try {
    const Blog = await Blog.findById(req.params.id);
    if (!Blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }
    res.status(200).json({ success: true, data: Blog });
  } catch (error) {
    next(error);
  }
};

// Update a Blog by ID
exports.updateBlog = async (req, res, next) => {
  try {
    const Blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!Blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }
    res.status(200).json({ success: true, data: Blog });
  } catch (error) {
    next(error);
  }
};

// Delete a Blog by ID
exports.deleteBlog = async (req, res, next) => {
  try {
    const Blog = await Blog.findByIdAndDelete(req.params.id);
    if (!Blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// Delete a Blog by ID
exports.assignBlogs = async (req, res, next) => {
  try {
    const Blogs = await Blog.find({ isAssigned: false });
    console.log(Blogs.length)
    console.log(req.body.no)
    console.log(req.body.userId)
    // console.log(req)
    if (!Blogs) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }
    // Update each Blog with the assigned user
    if (req.body.no < Blogs.length) {
      const leedsAssign = Blogs.slice(0, req.body.no);
      console.log(leedsAssign)
      const updates = leedsAssign.map((Blog) =>
        Blog.findByIdAndUpdate(
          Blog._id,
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
          message: `${leedsAssign.length} Blogs assigned successfully`,
        });
    } else {
      res
        .status(200)
        .json({ success: false, message: `${req.body.no} no enough Blogs` });
    }
  } catch (error) {
    next(error);
  }
};

