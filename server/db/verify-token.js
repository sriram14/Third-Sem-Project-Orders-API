const jwt = require('jsonwebtoken')

module.exports = function(req,res,next) {
    let token =  req.body.token || req.query.key || req.headers['x-access-token']
    if (token) {
        jwt.verify(token, process.env.JWT_KEY, (err, decodedToken) => {
            if(decodedToken){
                next()
            }
            else {
                return res.status(401).send('Authentication failed')
            }
        })
    }
}