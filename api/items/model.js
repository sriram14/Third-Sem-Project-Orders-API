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


let ItemModel = mongoose.model('ItemModel',itemSchema)

module.exports = ItemModel