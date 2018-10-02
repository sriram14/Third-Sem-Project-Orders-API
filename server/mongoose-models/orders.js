const mongoose = require('mongoose')

const orderSchema =  new mongoose.Schema({
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

let Order = mongoose.model('Order',orderSchema)

module.exports = Order