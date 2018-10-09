const jwt = require('jsonwebtoken')

module.exports = function(req,res,next) {
    let authToken = ''
    if(req.headers.cookie && req.headers.cookie.includes('authTokenSupplier')){
        let b = req.headers.cookie.match('(^|;)\\s*' + 'authTokenSupplier' + '\\s*=\\s*([^;]+)')
        authToken = b ? b.pop() : ''
    }
    jwt.verify(authToken, process.env.JWT_KEY, (err, decodedToken) => {
        if(decodedToken){
            req.name = decodedToken.name
            next()
        }
        else {
            return res.status(401).send('Authentication failed')
        }
    })

}