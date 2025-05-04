const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
mongoose.connect(process.env.MONGO_URI)

async function createAdmin() {
   const hashedPassword = await bcrypt.hash('admin123',10);
   await User.create({
    "name": "admin",
    "email": "admin@gmail.com",
    "password": hashedPassword,
    "confirmPassword": hashedPassword,
    "role": "admin"
   })
 
   console.log('admin created successfully')
   mongoose.disconnect();
}
createAdmin();
