const router = require('express').Router()
const Order = require('../items/model')
const ObjectID = require('mongoose').Types.ObjectId
const verifyToken = require('../../server/db/verify-token')

router.get('/',verifyToken,(req,res)=>{
    Order.find({})
        .select('_id name quantity')
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
        .then((doc)=>{
            if(doc)
                res.status(200).send(doc)
            else
                res.status(400).send('ID not found')
        })
})

router.patch('/:id',verifyToken,(req,res)=>{
    const id = req.params.id
    if(!ObjectID.isValid(id)){
        return res.status(400).send('Invalid ID')
    }

    const updateOps = {}
    for(let op in req.body){
        updateOps[op] = req.body[op]
    }
    Order.findOneAndUpdate({_id: id},{$set: updateOps},{returnOriginal: false}).then((doc)=>{
        res.status(200).send(doc)
    })
        .catch((err)=>{
            res.status(400).send(err)
        })
})


router.delete('/:id',verifyToken,(req,res)=>{
    const id = req.params.id
    if(!ObjectID.isValid(id)){
        return res.status(400).send('Invalid ID')
    }
    Order.deleteOne({_id: id}).then((doc)=>{
        if(doc){
            res.status(200).send(`Document deleted successfully`)
            console.log(doc)
        }
        else
            res.status(400).send('No such item exists')
    })
        .catch((err)=>{
            console.log(err)
            res.status(400).send('Cannot delete')
        })
})

module.exports = router