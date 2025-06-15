const User = require('./../models/User')
const Product = require('./../models/Product')
const catchAsync = require('./../utilities/catchAsync');
const AppError = require('./../utilities/AppError')

exports.getUnverifiedSeller = catchAsync(async(req , res ) => {
  const sellers = await User.find({role: 'seller' , isVerifiedSeller: false });
  res.status(200).json(sellers);
});
exports.getUnverifiedProduct   = catchAsync(async(req , res ) => {
  const unverifiedProduct = await Product.find({ isVerifiedSeller: false });
  res.status(200).json(unverifiedProduct);
});
exports.verifySeller = catchAsync(async(req, res) => {
    const verifiedSeller = await User.findByIdAndUpdate(req.params.id , {isVeifiedSeller: true}, {new: true} )
    if(!verifiedSeller){
        return next(new AppError('the user doesn\'t exist' , 404))
    }
    res.status(200).json(verifiedSeller)
});
exports.verifyProduct = catchAsync(async(req, res) => {
  const verifiedProduct = await Product.findByIdAndUpdate(req.params.id , {isVerifiedProduct: true}, {new: true} )
  if(!verifiedProduct){
      return next(new AppError('the product doesn\'t exist' , 404))
  }
  res.status(200).json(verifiedProduct)
});