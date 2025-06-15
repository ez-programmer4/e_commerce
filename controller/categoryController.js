const express = require('express')
const Category = require('../models/category')
const catchAsync = require('../utilities/catchAsync')
const AppError = require('../utilities/AppError')

exports.getCategory = catchAsync(async (req , res , next) => {
    const categories = await Category.find({parent_id: null , is_active: true})
    if (!categories || categories.length === 0) {
    return next(new AppError('No categories found', 404));
  }

  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: {
      categories
    }
  })
})