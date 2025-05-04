const {promisify} = require('util')
const jwt = require("jsonwebtoken");
const catchAsync = require('./../utilities/catchAsync');
const AppError = require('./../utilities/AppError')

const authMiddleware = catchAsync(async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return next(new AppError('you are not logged in , please log in to get accesss' , 401))
  }
    
     // verify token
   const decoded = await promisify(jwt.verify)(token , process.env.JWT_SECRET);
   // check if user still exists
   const freshUser = await User.findById(decoded.id)
   if(!freshUser) {
    return next(new AppError('the user belonging to this token does not exist' , 401))
   }
req.user = freshUser;
   next();
})

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return next(new AppError("only admin have access" , 403))
  }
  
  next();
};
const sellerMiddleware= (req , res , next) => {
  if(req.user.role !== 'seller') {
    return next(new AppError('you are not registered as seller'))
  }
  next();
}

module.exports = { authMiddleware, adminMiddleware, sellerMiddleware };
