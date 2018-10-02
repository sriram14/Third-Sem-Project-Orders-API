const router = require('express').Router()
const Order = require('../mongoose-models/orders')

router.get('/',(req,res)=>{

})

router.post('/',(req,res)=>{

})

router.get('/:id',(req,res)=>{
    const id = req.params.id
    Order.findById({_id: id}).then()
})

module.exports = router