const express = require('express');
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} = require('../../controllers/projectController');

const router = express.Router();

router.route('/')
  .get( getProjects)
  .post(createProject);

router.route('/:id')
  .get(getProject)
  .put(updateProject)
  .delete( deleteProject);



module.exports = router;
