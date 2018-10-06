const router = require('express').Router()
const User = require('./model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const verifyToken = function(req,res,next) {
    let token = req.body.token || req.query.token || req.headers['x-access-token']
    if (token) {
        jwt.verify(token, process.env.JWT_TOKEN, (err, decodedToken) => {
            if (err) {
                return res.status(401).send('Authentication failed')
            }
            next()
        })
    }
}

router.get('/login',(req,res)=>{
    res.render('./layouts/login.hbs',{title: "Login",subtitle: "Login to your account"})
})

router.get('/register',(req,res)=>{
    res.render('./layouts/login.hbs',{title: "Register",subtitle: "Register a new account"})
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
                    let token = jwt.sign({_id: userResult._id.toHexString(), access}, process.env.JWT_KEY ,{
                        expiresIn: "1h"
                    }).toString()
                    let accessToken = {access,token}
                    userResult.tokens.push(accessToken)
                    res.cookie('auth-token',token,{expires: new Date(Date.now() + 360000)})
                    userResult.save().then(()=>{
                    }).catch(()=>{
                            return res.status(401).send('Authorization failed')
                        })
                    res.status(200).json({
                        message: 'Logged in successfully',
                        accessToken
                    })
                }
                else{
                    return res.status(401).send('Authorization failed')
                }
            })
        })
        .catch(()=>{
            res.status(400).send('Cannot login. Please try again later')
        })
})


module.exports = router