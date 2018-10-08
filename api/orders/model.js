const mongoose = require('mongoose')

const orderSchema =  new mongoose.Schema({
    itemID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    }
})

let Order = mongoose.model('Order',orderSchema)

module.exports = Order