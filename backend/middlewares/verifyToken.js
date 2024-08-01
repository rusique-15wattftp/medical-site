const jwt = require('jsonwebtoken')

function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
        return res.status(401).json({
            error: true,
            message: 'Unauthorized - No token provided',
            status: 401,
        })
    }

    jwt.verify(token, process.env.secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                error: true,
                message: 'Unauthorized - Invalid token',
                status: 401,
            })
        }

        req.decodedtoken = decoded
        next()
    })
}

module.exports = verifyToken
