const express = require('express');
const { getLists, createList } = require('../controllers/listController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getLists)
  .post(createList);

module.exports = router;