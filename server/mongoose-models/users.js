const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
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

userSchema.methods.generateAuthToken = function(){
    let user = this;
    let access = 'auth'
    let token = jwt.sign({_id: user._id.toHexString(), access},'strongpass',).toString()

    user.tokens.concat([access,token])

    return user.save().then(()=>{})
        return token
}
let Supplier = mongoose.model('Supplier',userSchema)
let Customer = mongoose.model('Customer',userSchema)

module.exports = {Supplier,Customer}