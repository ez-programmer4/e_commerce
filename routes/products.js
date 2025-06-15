const express = require("express");
const router = express.Router();
const { authMiddleware , sellerMiddleware } = require("../middleware/auth");
const productController = require('./../controller/productController')


router.route('/')
.get(productController.getAllProduct)
.post(authMiddleware , sellerMiddleware , productController.sellerPostProduct)



module.exports = router;
