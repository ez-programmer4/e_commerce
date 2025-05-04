const mongoose = require('mongooose');

const categorySchema = mongoose.Schema({
    categoryName: {
        type: String,
        required: [true , 'category is required'],
        unique: true
    }
})

const Category = mongoose.model('Category' , categorySchema )
module.exports = Category