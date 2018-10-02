const express = require('express')
const hbs = require('express-handlebars')
const mongoose = require('./server/db/mongoose')
const itemRouter = require('./server/routes/item')
const orderRouter = require('./server/routes/order')
const userRouter = require('./server/routes/user')

const app = express()
const port = process.env.port || 3000

app.engine('hbs', hbs({extname: 'hbs', layoutsDir: __dirname + '/views/layouts/'}));
app.set('view engine', 'hbs');

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

app.use((err,req,res)=>{
    res.status(err.status || 500)
    res.render('./layouts/error.hbs',{error:err})
})

app.listen(port , ()=>{
    console.log(`App started at port ${port}`)
})