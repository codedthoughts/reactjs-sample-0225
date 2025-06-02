const express = require('express');
const { getTasks, createTask } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

// Task routes
router.route('/')
  .get(getTasks)
  .post(createTask);

module.exports = router;
