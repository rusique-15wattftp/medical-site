var returnStatus = require('../helpers/returnStatus')

function checkIDNumber(req, res, next) {
    const { idnumber } = req.body

    if (!idnumber) {
        returnStatus(res, 400, true, 'idnumber field is missing')
        return next(new Error('idnumber field is missing'))
    }

    const idnumberRegex = /^\d{8}$/

    const result = idnumberRegex.test(idnumber)

    if (!result) {
        returnStatus(res, 400, true, 'id number is invalid')
        return next(new Error('id number is invalid'))
    }

    next()
}

function checkUserName(req, res, next) {
    const { username } = req.body

    if (!username) {
        returnStatus(res, 400, true, 'username field is missing')
        return next(new Error('username field is missing'))
    }

    const usernameRegex = /^[a-zA-Z\s]+$/

    if (username.length > 50) {
        returnStatus(res, 400, true, 'username too long')
        return next(new Error('username too long'))
    }

    const result = usernameRegex.test(username)

    if (!result) {
        returnStatus(res, 400, true, 'username is invalid')
        return next(new Error('username is invalid'))
    }

    next()
}

function checkPassword(req, res, next) {
    const { password } = req.body

    if (!password) {
        returnStatus(res, 400, true, 'password is missing')
        return next(new Error('password is missing'))
    }

    if (password.length > 20) {
        returnStatus(
            res,
            400,
            true,
            'Password too long,max 20 characters allowed'
        )
        return next(
            new Error('Password too long,max 20 characters allowed')
        )
    }

    next()
}

function checkEmail(req, res, next) {
    const { email } = req.body

    if (!email) {
        returnStatus(res, 400, true, 'Email is missing')
        return next(new Error('Email is missing'))
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (email.length > 50) {
        returnStatus(res, 400, true, 'Email too long')
        return next(new Error('Email too long'))
    }

    const result = emailRegex.test(email)

    if (!result) {
        returnStatus(res, 400, true, 'Email is invalid')
        return next(new Error('Email is invalid'))
    }

    next()
}

function checkAddress(req, res, next) {
    const { address } = req.body

    if (!address) {
        returnStatus(res, 400, true, 'Address is missing')
        return next(new Error('Address is missing'))
    }

    if (address.length > 100) {
        returnStatus(res, 400, true, 'address too long')
        return next(new Error('address too long'))
    }

    const addressRegex = /^[a-zA-Z0-9\s.,\/'-]+$/

    const result = addressRegex.test(address)

    if (!result) {
        returnStatus(res, 400, true, 'Address is invalid')
        return next(new Error('Address is invalid'))
    }

    next()
}

function checkPhoneNumber(req, res, next) {
    const { phone } = req.body

    if (!phone) {
        returnStatus(res, 400, true, 'Phone is missing')
        return next(new Error('Phone is missing'))
    }

    if (phone.length > 17) {
        returnStatus(res, 400, true, 'phone too long')
        return next(new Error('phone too long'))
    }

    const phoneRegex = /^[0-9 ()+-]+$/
    const result = phoneRegex.test(phone)

    if (!result) {
        returnStatus(res, 400, true, 'Phone is invalid')
        return next(new Error('Phone is invalid'))
    }

    next()
}

function checkMedicalRecord(req, res, next) {
    const { medicalrecord } = req.body

    if (medicalrecord.length > 450) {
        returnStatus(res, 400, true, 'medical record too long')
        return next(new Error('medical record too long'))
    }

    const medicalRecordRegex = /^(?:[^<>|]*)$/

    const result = medicalRecordRegex.test(medicalrecord)

    if (!result) {
        returnStatus(res, 400, true, 'Medical Record is invalid')
        return next(new Error('Medical Record is invalid'))
    }

    next()
}

module.exports = {
    checkIDNumber: checkIDNumber,
    checkUserName: checkUserName,
    checkPassword: checkPassword,
    checkEmail: checkEmail,
    checkAddress: checkAddress,
    checkPhoneNumber: checkPhoneNumber,
    checkMedicalRecord: checkMedicalRecord,
}
