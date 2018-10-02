const router = require('express').Router()
const Item = require('../mongoose-models/item')

router.get('/',(req,res)=>{
    Item
})

router.post('/',(req,res)=>{
    const item = new Item({
        name: req.body.name,
        quantity: req.body.quantity
    })

    item.save()
        .then((doc)=>{
            res.send(doc)
        })
        .catch((err)=>{
            res.status(400).send(err)
        })

})

router.get('/:id',(req,res)=>{
    const id = req.params.id
    Item.findById({_id: id})
        .then((doc)=>{
            res.status(200).send(doc)
        })
})

module.exports = router