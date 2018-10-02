const mongoose = require('./server/db/mongoose')
const express = require('express')

const {Supplier,Customer} = require('./server/mongoose-models/users')
const {Item} = require('./server/mongoose-models/item')
const app = express()
const port = process.env.port || 3000

app.use(express.json())

app.post('/supplier',(req,res)=>{

    let supplier = new Supplier({
        email: req.body.email,
        password: req.body.password
    })

    supplier.save().then((val)=>{
        res.send(val)
    },(err)=>{
        res.status(400).send(err)
    })
})

app.post('/customer',(req,res)=>{
    let customer = new Customer({
        email: req.body.email,
        password: req.body.password
    })

    customer.save().then((val)=>{
        res.send(val)
    },(err)=>{
        res.status(400).send(err)
    })
})

// app.get()

// app.delete()

// app.update()

app.listen(port,()=>{
    console.log(`App connected to port ${port}`)
})