const mongoose = require('mongoose')

const orderSchema =  new mongoose.Schema({
    itemID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    quantity: {
        min: 1,
        type: Number,
        default: 1
    },
    date: {
        type: Date,
        default: Date.now
    }
})

let Order = mongoose.model('Order',orderSchema)

module.exports = Order