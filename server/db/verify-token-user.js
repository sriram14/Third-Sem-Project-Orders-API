const jwt = require('jsonwebtoken')

module.exports = function(req,res,next) {
    let authToken = ''
    let id = ''
    if(req.headers.cookie && req.headers.cookie.includes('authTokenUser')){
        let b = req.headers.cookie.match('(^|;)\\s*' + 'authTokenUser' + '\\s*=\\s*([^;]+)')
        authToken = b ? b.pop() : ''
        id = req.headers.cookie.match('(^|;)\\s*' + '_id' + '\\s*=\\s*([^;]+)')
        id = id? id.pop(): ''
        id = id.substr(7,24)
    }
    jwt.verify(authToken, process.env.JWT_KEY, (err, decodedToken) => {
        if(decodedToken._id===id){
            req.id = decodedToken._id
            next()
        }
        else {
            return res.status(401).send('Authentication failed')
        }
})

}