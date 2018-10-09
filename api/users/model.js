const mongoose = require('mongoose')
const validator = require('validator')


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
           validator: validator.isEmail,
           message: '{VALUE} is not valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },

    orders: [{
        order:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
            required: true
        },
        quantity:{
            type: Number,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],

    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
})

let Supplier = mongoose.model('Supplier',userSchema)
let User = mongoose.model('Customer',userSchema)

module.exports = {User,Supplier}