const router = require('express').Router()
const User = require('../mongoose-models/users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.get('/',(req,res)=>{

})

router.post('/register',(req,res)=>{
    User.find({email: req.body.email}).then((doc)=>{
        if(doc.length>0){
           return res.status(422).send('An account already exists for the email')
        }
        bcrypt.hash(req.body.password,10, (err,hashedPass)=>{
            if(err){
                return res.status(400).send(err)
            }
            let user = new User({
                email : req.body.email,
                password: hashedPass
            })
            user.save()
                .then((doc)=>{
                    res.status(201).send('User created')
                })
                .catch((err)=>{
                res.status(400).send(err)
            })
        })
    })
})

router.post('/login',(req,res)=>{
    User.findOne({email : req.body.email})
        .then((userResult)=>{
            if(!userResult){
               return res.status(401).send('Authorization failed')
            }
            bcrypt.compare(req.body.password, userResult.password,(err,result)=>{
                if(result){
                    let access = 'auth'
                    let token = jwt.sign({_id: userResult._id.toHexString(), access}, 'Zb%u0WV28w8B' ,{
                        expiresIn: "1h"
                    }).toString()
                    let accessToken = {access,token}
                    userResult.tokens.push(accessToken)
                    return res.status(200).json({
                            message: 'Logged in successfully',
                            accessToken
                        })
                }
                if(err == null){
                    return res.status(401).send('Authorization failed')
                }
            })
        })
        .catch(()=>{
            res.status(400).send('Cannot login. Please try again later')
        })
})

router.get('/:id',(req,res)=>{
    const id = req.params.id
    User.findById({_id: id}).then()
})

module.exports = router