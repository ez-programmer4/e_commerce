const express = require('express');
const router = express.Router();
const adminController = require('./../controller/adminController')
const {authMiddleware , adminMiddleware} = require('./../middleware/auth')
const catchAsync = require('./../utilities/catchAsync');
const AppError = require('./../utilities/AppError')


router.get('/unverified-seller' , authMiddleware ,  adminMiddleware ,  adminController.getUnverifiedSeller);
router.get('/unverified-product' , authMiddleware ,  adminMiddleware ,  adminController.getUnverifiedSeller);
router.patch('/users/:id/verify_seller' , authMiddleware , adminMiddleware , adminController.verifySeller)
router.patch('/products/:id/verify_Product' , authMiddleware , adminMiddleware , adminController.verifySeller)
module.exports = router;

