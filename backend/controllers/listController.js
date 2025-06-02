const List = require('../models/List');

exports.getLists = async (req, res) => {
  try {
    const lists = await List.find({ userId: req.user._id }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: lists
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.createList = async (req, res) => {
  try {
    req.body.userId = req.user._id;
    
    const list = await List.create(req.body);
    
    res.status(201).json({
      success: true,
      data: list
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};