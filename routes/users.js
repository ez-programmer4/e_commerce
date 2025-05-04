const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const catchAsync = require('./../utilities/catchAsync')
const AppError = require('./../utilities/AppError')

const signToken = (user) => { return  jwt.sign(
  { userId: user._id, isAdmin: user.isAdmin },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
)};

router.post("/register", catchAsync(async (req, res) => {
  
    const existingUser = await User.findOne({email: req.body.email} );
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }
   const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword

   })
   
    const token = signToken(user);
    res
      .status(201)
      .json({
        token,
        user: { id: user._id, 
          email: user.email, 
          name: user.name, 
          role: user.role },
      });
  
}));

router.post("/login", catchAsync(async (req, res) => 
{
    const { email, password } = req.body;
    if(!email || !password) {
      return res.status(400).json({error : "please enter email and password"})
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const isMatch = await correctPassword(password , user.password)
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid  password" });
    }

    const token = signToken(user);

    res.json({
      token,
      user: { id: user._id, 
        email: user.email, 
        name: user.name, 
        role: user.role },
    });

}));

module.exports = router;
