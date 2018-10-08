const jwt = require('jsonwebtoken')

module.exports = function(req,res,next) {
    let authToken = ''
    if(req.headers.cookie){
        let cookie = req.headers.cookie.split('=')
        authToken = cookie[1]
    }
    jwt.verify(authToken, process.env.JWT_KEY, (err, decodedToken) => {
    if(decodedToken){
        next()
    }
    else {
        return res.status(401).send('Authentication failed')
    }
})

}