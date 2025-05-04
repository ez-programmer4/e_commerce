const express = require('express');
const router = express.Router();
const User = require('./../models/User')
const Product = require('./../models/Product')
const {authMiddleware , adminMiddleware} = require('./../middleware/auth')
const catchAsync = require('./../utilities/catchAsync');
const AppError = require('./../utilities/AppError')


router.get('/unverified-seller' , authMiddleware ,  adminMiddleware ,  catchAsync(async(req , res ) => {
  const sellers = await User.find({role: 'seller' , isVerifiedSeller: false });
  res.status(200).json(sellers);
}));
router.get('/unverified-product' , authMiddleware ,  adminMiddleware ,  catchAsync(async(req , res ) => {
  const unverifiedProduct = await Product.find({ isVerifiedSeller: false });
  res.status(200).json(unverifiedProduct);
}));
router.patch('/users/:id/verify_seller' , authMiddleware , adminMiddleware , catchAsync(async(req, res) => {
    const verifiedSeller = await User.findByIdAndUpdate(req.params.id , {isVerifiedSeller: true}, {new: true} )
    if(!verifiedSeller){
        return next(new AppError('the user doesn\'t exist' , 404))
    }
    res.status(200).json(verifiedSeller)
}))
router.patch('/products/:id/verify_Product' , authMiddleware , adminMiddleware , catchAsync(async(req, res) => {
  const verifiedProduct = await Product.findByIdAndUpdate(req.params.id , {isVerifiedProduct: true}, {new: true} )
  if(!verifiedProduct){
      return next(new AppError('the product doesn\'t exist' , 404))
  }
  res.status(200).json(verifiedProduct)
}))
module.exports = router;

