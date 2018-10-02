const router = require('express').Router()
const Item = require('../mongoose-models/item')
const ObjectID = require('mongoose').Types.ObjectId

router.get('/',(req,res)=>{
    Item.find({}).then((doc)=>{
        res.status(200).send(doc)
    })
        .catch((err)=>{
            res.status(400).send(err)
        })
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
    if(!ObjectID.isValid(id)){
        return res.status(400).send('Invalid ID')
    }
    Item.findById(id)
        .then((doc)=>{
            if(doc)
                res.status(200).send(doc)
            else
                res.status(400).send('ID not found')
        })
})

router.patch('/:id',(req,res)=>{
    const id = req.params.id
    if(!ObjectID.isValid(id)){
        return res.status(400).send('Invalid ID')
    }

    const updateOps = {}
    for(let op in req.body){
        updateOps[op] = req.body[op]
    }
    Item.findOneAndUpdate({_id: id},{$set: updateOps},{returnOriginal: false}).then((doc)=>{
        res.status(200).send(doc)
    })
        .catch((err)=>{
            res.status(400).send(err)
        })
})


router.delete('/:id',(req,res)=>{
    const id = req.params.id
    if(!ObjectID.isValid(id)){
        return res.status(400).send('Invalid ID')
    }
    Item.deleteOne({_id: id}).then((doc)=>{
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