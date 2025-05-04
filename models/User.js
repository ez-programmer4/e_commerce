const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false
  },
  confirmPassword: {
    type: String,
    required: [true, "please confirm your password"],
    validate: {
      validator: function(el) {
        return this.password === el
      },
      message: "the password must match"
    }
  },
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    maxlength: [50, "Name cannot exceed 50 characters"],
  },
  role: {
    type: String,
    enum: ['user' , 'seller' , 'admin'],
    default: 'user'
  },
  isVerifiedSeller: {
    type: Boolean,
    default: false

  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
userSchema.pre('save' ,async function(next) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  this.confirmPassword = undefined;

next()
})
userSchema.methods.correctPassword = async function(candidatePassword , userPassword) {
  return await bcrypt.compare(candidatePassword , userPassword)
}

module.exports = mongoose.model("User", userSchema);
