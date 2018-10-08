const express = require('express')
const hbs = require('express-handlebars')
const mongoose = require('./server/db/mongoose')
const itemRouter = require('./api/items/router')
const orderRouter = require('./api/orders/router')
const userRouter = require('./api/users/router')
const cookieParser = require('cookie-parser')

const app = express()
const port = process.env.port || 3000

app.engine('hbs', hbs({extname: 'hbs', layoutsDir: __dirname + '/views/layouts/'}));
app.set('view engine', 'hbs');

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
})
app.use('/item',itemRouter)
app.use('/order',orderRouter)
app.use('/user',userRouter)

app.use((req,res,next)=>{
    res.status = 404
    res.render('./layouts/error.hbs',{error:'404 Not found'})
})

app.listen(port , ()=>{
    console.log(`App started at port ${port}`)
})