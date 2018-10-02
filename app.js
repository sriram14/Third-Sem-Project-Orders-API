const express = require('express')
const app = express()

const mongoose = require('./server/db/mongoose')
const itemRouter = require('./server/routes/item')
const orderRouter = require('./server/routes/order')
const userRouter = require('./server/routes/user')

const port = process.env.port || 3000

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use('/item',itemRouter)
app.use('/order',orderRouter)
app.use('/user',userRouter)

app.use((req,res,next)=>{
    const err = new Error('Not found')
    err.status = 404
    next(err)
})

app.use((err,req,res,next)=>{
    res.status(err.status || 500)
    res.send(err.message)
})

app.listen(port , ()=>{
    console.log(`App started at port ${port}`)
})