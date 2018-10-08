const router = require('express').Router()
const Order = require('../orders/model')
const Item = require('../items/model')
const ObjectID = require('mongoose').Types.ObjectId
const verifyToken = require('../../server/db/verify-token')

router.get('/',verifyToken,(req,res)=>{
    Order.find({})
        .populate('itemID')
        .then((doc)=>{
        res.status(200).send(doc)
    })
        .catch((err)=>{
            res.status(400).send(err)
        })
})

router.get('/:id',verifyToken,(req,res)=>{
    const id = req.params.id
    if(!ObjectID.isValid(id)){
        return res.status(400).send('Invalid ID')
    }
    Order.findById(id)
        .populate('itemID')
        .then((doc)=>{
            if(doc)
                res.status(200).send(doc)
            else
                res.status(400).send('ID not found')
        })
})

router.post('/',verifyToken,(req,res)=>{
    Item.findById(req.body.itemID).then(item=>{
        if(!item){
            res.status(500).send('Item not found')
        }
        const order = new Order({
        itemID: req.body.itemID,
        quantity: req.body.quantity
    })
    order.save()
        .then((doc)=>{
            res.send(doc)
        })
        .catch((err)=>{
            res.status(400).send(err)
        })
    })
        .catch(err=>{
            res.status(500).send(err)
        })

})
//
// router.patch('/:id',verifyToken,(req,res)=>{
//     const id = req.params.id
//     if(!ObjectID.isValid(id)){
//         return res.status(400).send('Invalid ID')
//     }
//
//     const updateOps = {}
//     for(let op in req.body){
//         updateOps[op] = req.body[op]
//     }
//     Order.findOneAndUpdate({_id: id},{$set: updateOps},{returnOriginal: false}).then((doc)=>{
//         res.status(200).send(doc)
//     })
//         .catch((err)=>{
//             res.status(400).send(err)
//         })
// })


router.delete('/:id',verifyToken,(req,res)=>{
    const id = req.params.id
    if(!ObjectID.isValid(id)){
        return res.status(400).send('Invalid ID')
    }
    Order.deleteOne({_id: id}).then((doc)=>{
        if(doc){
            res.status(200).send(`Order deleted successfully`)
            console.log(doc)
        }
        else
            res.status(400).send('No such order exists')
    })
        .catch((err)=>{
            console.log(err)
            res.status(400).send('Cannot delete')
        })
})

module.exports = router