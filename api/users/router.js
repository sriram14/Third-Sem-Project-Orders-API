const router = require('express').Router()
const {User,Supplier} = require('./model')
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const mongoose = require('../../server/db/mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const verifyTokenSupplier = require('../../server/db/verify-token-supplier')
const verifyTokenUser = require('../../server/db/verify-token-user')


router.use(cookieParser())

router.get('/login/customer',(req,res)=>{
    res.clearCookie('authTokenSupplier')
    res.clearCookie('authTokenUser')
    res.clearCookie('_id')
    res.render('./layouts/login.hbs',{title: "Customer Login",subtitle: "Login to your account",register: false})
})

router.get('/login/supplier',(req,res)=>{
    res.clearCookie('authTokenSupplier')
    res.clearCookie('authTokenUser')
    res.clearCookie('_id')
    res.render('./layouts/login.hbs',{title: "Supplier Login",subtitle: "Login to your account",register: false})
})

router.get('/customer/dashboard',verifyTokenUser,(req,res)=>{
    res.render('./layouts/index.hbs',{ title:'Customer Dashboard',supplier:false,name: 'Customer'})
})

router.get('/supplier/dashboard',verifyTokenSupplier,(req,res)=>{

    res.render('./layouts/index.hbs',{ title:'Supplier Dashboard',supplier:true,name: 'Supplier'})
})



router.get('/register/supplier',(req,res)=>{
    res.render('./layouts/login.hbs',{title: "Register",subtitle: "Register a new supplier account",register: true})
})

router.get('/register/customer',(req,res)=>{
    res.render('./layouts/login.hbs',{title: "Register",subtitle: "Register a new customer account",register: true})
})

router.get('/logout',(req,res)=>{
    if (req.session) {
        req.session.destroy((err)=> {
            if(err) {
                res.status(500).send(err);
            } else {
                res.clearCookie('authTokenSupplier')
                res.clearCookie('authTokenUser')
                res.clearCookie('_id')
                return res.redirect('/');
            }
        })
    }
})

router.post('/register/supplier',(req,res)=>{
    Supplier.find({email: req.body.email}).then((doc)=>{
        if(doc.length>0){
           return res.status(422).send('An account already exists for the email')
        }
        bcrypt.hash(req.body.password,10, (err,hashedPass)=>{
            if(err){
                return res.status(400).send(err)
            }
            let supplier = new Supplier({
                name: req.body.name,
                email : req.body.email,
                password: hashedPass
            })
            supplier.save()
                .then((doc)=>{
                    res.status(201).send('User created')
                })
                .catch((err)=>{
                    res.status(400).send(err)
            })
        })
    })
})

router.post('/register/customer',(req,res)=>{
    User.find({email: req.body.email}).then((doc)=>{
        if(doc.length>0){
            return res.status(422).send('An account already exists for the email')
        }
        bcrypt.hash(req.body.password,10, (err,hashedPass)=>{
            if(err){
                return res.status(400).send(err)
            }
            let user = new User({
                name: req.body.name,
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

router.post('/login/customer',(req,res)=>{
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
                    res.cookie('authTokenUser',token,{expires: new Date(Date.now() + 3600000)})
                    res.cookie('_id',userResult._id)
                    userResult.save().then(()=>{
                        req.session.user = userResult
                        res.redirect('/user/customer/dashboard')
                    }).catch(()=>{
                            res.status(401).send('Authorization failed')
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


router.post('/login/supplier',(req,res)=>{
    Supplier.findOne({email : req.body.email})
        .then((userResult)=>{
            if(!userResult){
                res.status(401).send('Authorization failed')
            }
            bcrypt.compare(req.body.password, userResult.password,(err,result)=>{
                if(result){
                    let access = 'auth'
                    let token = jwt.sign({_id: userResult._id.toHexString(), access}, process.env.JWT_KEY ,{
                        expiresIn: "1h"
                    }).toString()
                    let accessToken = {access,token}
                    userResult.tokens.push(accessToken)
                    res.cookie('authTokenSupplier',token,{expires: new Date(Date.now() + 3600000)})
                    res.cookie('_id',userResult._id)
                    userResult.save().then(()=>{
                    }).catch(()=>{
                        //res.status(401).send('Authorization failed')
                    })
                    res.redirect('/user/supplier/dashboard')
                }
                else{
                    res.status(401).send('Authorization failed')
                }
            })
        })
        .catch(()=>{
            res.status(400).send('Cannot login. Please try again later')
        })
})

module.exports = router