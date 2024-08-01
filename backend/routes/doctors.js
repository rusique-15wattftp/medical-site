const express = require('express')
const router = express.Router()
const doctorsController = require('../controllers/doctorsController')
const verifyToken = require('../middlewares/verifyToken')

const returnStatus = require('../helpers/returnStatus')
const fs = require('fs')
const path = require('path')
const formidable = require('formidable')

const {
    checkIDNumber,
    checkPhoneNumber,
    checkEmail,
    checkPassword,
    checkUserName,
} = require('../middlewares/checkInputs')

router.post(
    '/registerdoctor',
    verifyToken,
    (req, res, next) => {
        const uploadDir = path.join(__dirname, '..', 'uploads')
        const form = new formidable.IncomingForm({
            uploadDir: uploadDir,
            maxFileSize: 1 * 1024 * 1024,
        })

        form.parse(req, async (err, fields, files) => {
            if (err) {
                return returnStatus(
                    res,
                    400,
                    true,
                    'Error uploading file, file limit 1MB'
                )
            }

            const formdata = JSON.parse(fields.data)

            if (formdata) {
                const { idnumber, phone, email, username, password } =
                    formdata

                req.body.idnumber = idnumber
                req.body.phone = phone
                req.body.email = email
                req.body.username = username
                req.body.password = password
                req.uploadedImageFilePath = files.file[0].filepath
                req.uploadedImageName = files.file[0].originalFilename

                next()
            } else {
                return returnStatus(
                    res,
                    400,
                    true,
                    "User data doesn't exist"
                )
            }
        })
    },
    checkIDNumber,
    checkPhoneNumber,
    checkEmail,
    checkUserName,
    checkPassword,

    doctorsController.registerDoctor
)

router.get('/search', doctorsController.searchDoctor)

router.post(
    '/updatecontact',
    verifyToken,
    checkIDNumber,
    checkEmail,
    checkPhoneNumber,
    doctorsController.updateContact
)

router.use((err, req, res, next) => {
    if (req.uploadedImageFilePath) {
        console.log(req.uploadedImageFilePath)
        fs.unlink(req.uploadedImageFilePath, err => {
            if (err) {
                console.error('Error deleting temporary file:', err)
            }
            console.log('File deleted successfully')
        })
    }

    console.log('FROM doctors route middleware', err.message)
})

module.exports = router
