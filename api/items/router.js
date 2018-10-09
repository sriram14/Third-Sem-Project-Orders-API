const router = require('express').Router()
const Item = require('./model')
const ObjectID = require('mongoose').Types.ObjectId
const verifyTokenSupplier = require('../../server/db/verify-token-supplier')

router.get('/',(req,res)=>{
    Item.find({})
        .select('_id name price')
        .then((doc) => {
             res.render('./layouts/item.hbs',{item: doc,title:'View products'})
        })
        .catch((err) => {
            res.status(400).send(err)
        });
})

router.get('/new',verifyTokenSupplier,(req,res)=>{
    res.render('./layouts/create-item.hbs',{title:'Add product'})
})

router.post('/',verifyTokenSupplier ,(req,res)=>{
    const item = new Item({
        name: req.body.name,
        price: req.body.price
    })

    item.save()
        .then((doc)=>{
            res.render('./layouts/product.hbs',{type: 'Product', name: req.body.name, price: req.body.price,title:'View product',user: 'Supplier'})
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
        .select('_id name price')
        .then((doc)=>{
            if(doc)
                res.render('./layouts/product.hbs',{name: doc.name,price: doc.price, type: 'Product',})
            else
                res.status(400).send('ID not found')
        })
})

router.patch('/:id', verifyTokenSupplier, (req,res)=>{
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


router.delete('/:id',verifyTokenSupplier, (req,res)=>{
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