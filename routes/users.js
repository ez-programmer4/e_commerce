const express = require("express");
const router = express.Router();
const userController = require('./../controller/userController')


router.post("/register",userController.register);
router.post("/login", userController.login);
router.post('/forgotPassword' ,userController.forgotPassword) 
  router.patch('/resetPassword/:token' , userController.resetPassword)
  router.patch('/updatePassword' ,userController.updatePassword )

module.exports = router;
