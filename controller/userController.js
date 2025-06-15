const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const User = require("../models/User");
const catchAsync = require('./../utilities/catchAsync');
const AppError = require('./../utilities/AppError');
const sendEmail = require('./../utilities/email');

const signToken = (user) => {
  return jwt.sign(
    { userId: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

exports.register = catchAsync(async (req, res, next) => {
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    return next(new AppError("Email already registered", 400));
  }

  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword
  });

  const token = signToken(user);
  res.status(201).json({
    token,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please enter email and password", 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new AppError("Invalid email", 400));
  }

  const isMatch = await user.correctPassword(password, user.password);
  if (!isMatch) {
    return next(new AppError("Invalid password", 400));
  }

  const token = signToken(user);
  res.json({
    token,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    },
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  console.log('Forgot password request received for email:', req.body.email);
  
  const user = await User.findOne({ email: req.body.email });
  console.log('User found:', user ? 'Yes' : 'No');
  
  if (!user) {
    return next(new AppError("This user does not exist", 404));
  }

  const resetToken = user.createPasswordResetToken();
  console.log('Reset token created:', resetToken);
  
  try {
  await user.save({ validateBeforeSave: false });
  console.log('User saved with reset token');
} catch (err) {
  console.error('Error saving user:', err);
}

  const resetURL = `${req.protocol}://${req.get('host')}/api/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password and confirmPassword to: ${resetURL}. If you didn't forget your password, please ignore this email.`;
  console.log('Reset URL:', resetURL);

  try {
    console.log('Attempting to send email to:', user.email);
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 minutes)",
      message
    });
    console.log('Email sent successfully');

    res.status(200).json({
      status: 'success',
      message: "Token has been sent to email"
    });
  } catch (err) {
    console.error('Error sending email:', err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError("There was an error sending the email. Try again later.", 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto.createHash('sha256')
    .update(req.params.token)
    .digest('hex');
 console.log(hashedToken)
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });
  console.log("user found successfully")
  console.log('User with token:', await User.findOne({ passwordResetToken: hashedToken }))

  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  user.password = req.body.password;
  console.log("Password to save:", user.password);
  user.confirmPassword = req.body.confirmPassword;
  
  console.log("Confirm password to save:", user.confirmPassword);

  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  try {
  await user.save();
} catch (err) {
  console.error("Failed to save new password:", err);
  return next(new AppError("Could not reset password", 500));
}


  const token = signToken(user);
  res.status(200).json({
    status: 'success',
    token
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  const correct = await user.correctPassword(req.body.passwordCurrent, user.password);
  if (!correct) {
    return next(new AppError("Incorrect current password", 400));
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  const token = signToken(user);
  res.status(200).json({
    status: 'success',
    token
  });
});
