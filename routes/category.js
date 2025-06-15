const express = require('express')
const categoryController = require('../controller/categoryController.js')
const router = express.Router();

//get all top-level categories
router.get('/' , categoryController.getCategory);

module.exports = router;
