const mongoose = require('mongoose')

const itemSchema =  new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 1
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    }
})


let Item = mongoose.model('Item',itemSchema)

module.exports = Item