var jwt = require('jsonwebtoken')

function signToken(payload) {
    const token = jwt.sign(payload, process.env.secret, {
        expiresIn: '1h',
    })

    return token
}

module.exports = signToken
