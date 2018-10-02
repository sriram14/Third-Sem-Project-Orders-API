const router = require('express').Router()
const User = require('../mongoose-models/users')

router.get('/',(req,res)=>{

})

router.post('/',(req,res)=>{

})

router.get('/:id',(req,res)=>{
    const id = req.params.id
    User.findById({_id: id}).then()
})

module.exports = router