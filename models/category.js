const mongoose = require('mongooose');

const categorySchema = mongoose.Schema({
    categoryName: {
        type: String,
        required: [true , 'category is required'],
        unique: true
    },
    icon: {
        type: String,
    },
    slug: {
        type: String,
        slug: 'name',
        unique: true
    },
    parent_id: {
        type: mongoose.Schema.Types.ObjextId,
        ref: 'category',
        default: null
    },
     is_active: {
        type: Boolean,
        default: true
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
   
  
})

const Category = mongoose.model('Category' , categorySchema )
module.exports = Category