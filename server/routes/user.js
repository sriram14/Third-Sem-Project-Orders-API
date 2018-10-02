const router = require('express').Router()
const User = require('../mongoose-models/users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.get('/login',(req,res)=>{
    res.render('./layouts/login.hbs',{title: "Login"})
})

router.get('/register',(req,res)=>{
    res.render('./layouts/login.hbs',{title: "Register"})
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
               return res.status(401).send('Authorization failed 1')
            }
            bcrypt.compare(req.body.password, userResult.password,(err,result)=>{
                if(result){
                    let access = 'auth'
                    let token = jwt.sign({_id: userResult._id.toHexString(), access}, process.env.JWT_KEY ,{
                        expiresIn: "1h"
                    }).toString()
                    let accessToken = {access,token}
                    userResult.tokens.push(accessToken)
                    userResult.save().then(()=>{
                    }).catch(()=>{
                            return res.status(401).send('Authorization failed2')
                        })
                    res.status(200).json({
                        message: 'Logged in successfully',
                        accessToken
                    })
                }
                else{
                    return res.status(401).send('Authorization failed3')
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